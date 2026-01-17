# Redis Caching in Production: A Complete Guide

## Table of Contents
1. [Why Cache Doesn't Survive Deployments](#why-cache-doesnt-survive-deployments)
2. [Single Server Setup](#single-server-setup)
3. [Multi-Server Load Balanced Setup](#multi-server-load-balanced-setup)
4. [Why We Destroy Containers in CI/CD](#why-we-destroy-containers-in-cicd)
5. [When You Need Redis](#when-you-need-redis)

---

## Why Cache Doesn't Survive Deployments

### Next.js Built-in Cache Storage

Next.js stores its cache in two places:

1. **Memory (RAM)** - Fastest, but volatile
2. **File System** - `.next/cache/` folder inside the container

```
Docker Container:
┌─────────────────────────────────────┐
│  Next.js Application                │
│  ├─ /app (your code)                │
│  ├─ /node_modules                   │
│  └─ /.next/cache/  ← Cache here     │
│     ├─ fetch-cache                  │
│     └─ server-components            │
└─────────────────────────────────────┘
```

**Problem:** When you deploy, the container is destroyed → cache is lost!

---

## Single Server Setup

### Without Redis (Cache Loss on Deploy)

```
EC2 Instance
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────────────────────┐           │
│  │  Docker Container           │           │
│  │  ┌─────────────────────┐    │           │
│  │  │  Next.js App        │    │           │
│  │  │  Cache: Memory/Disk │    │           │
│  │  └─────────────────────┘    │           │
│  └─────────────────────────────┘           │
│                                             │
└─────────────────────────────────────────────┘

Deployment Flow:
1. Build new Docker image
2. Stop old container  ──────┐
3. Remove old container      │ ← Cache DELETED
4. Start new container  ──────┘
5. Cache is EMPTY (cold start)
```

**Impact:**
- ❌ First 1000 users after deploy hit cold cache
- ❌ 1000 database queries
- ❌ Slow response times (5-10 seconds)
- ❌ Potential database overload

### With Redis (Cache Survives Deploy)

```
EC2 Instance
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────┐    ┌──────────────────────┐   │
│  │  Docker: Next.js    │───▶│  Docker: Redis       │   │
│  │  (Stateless)        │    │  ┌────────────────┐  │   │
│  │  No cache stored    │    │  │  Cache Data    │  │   │
│  └─────────────────────┘    │  │  (Persistent)  │  │   │
│                              │  └────────────────┘  │   │
│                              │  Volume: redis-data │   │
│                              └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘

Deployment Flow:
1. Build new Next.js image
2. Stop Next.js container  ──────┐
3. Remove Next.js container      │ ← Only Next.js destroyed
4. Start new Next.js container  ──┘
5. Redis still running ✅
6. Cache AVAILABLE immediately ✅
```

**Impact:**
- ✅ Zero cache loss
- ✅ No database spike
- ✅ Instant fast responses
- ✅ Users don't notice deployment

---

## Multi-Server Load Balanced Setup

### Without Redis (Fragmented Cache)

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   EC2 Server 1     EC2 Server 2     EC2 Server 3
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Next.js  │     │ Next.js  │     │ Next.js  │
   │ Cache A  │     │ Cache B  │     │ Cache C  │
   └──────────┘     └──────────┘     └──────────┘
```

**Problem: Cache Fragmentation**

```
Request Flow:
─────────────────────────────────────────────────────────
User Request 1: Get /products
→ Load Balancer → Server 1
→ Cache Miss → Query DB → Store in Cache A
→ Response (slow: 500ms)

User Request 2: Get /products (SAME DATA!)
→ Load Balancer → Server 2 (different server)
→ Cache Miss ❌ (data is in Cache A, not B)
→ Query DB AGAIN → Store in Cache B
→ Response (slow: 500ms)

User Request 3: Get /products (SAME DATA!)
→ Load Balancer → Server 3
→ Cache Miss ❌ (data is in A and B, not C)
→ Query DB AGAIN → Store in Cache C
→ Response (slow: 500ms)
```

**Result:** 3 requests = 3 DB queries for identical data! 💸

### With Redis (Shared Cache)

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   EC2 Server 1     EC2 Server 2     EC2 Server 3
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Next.js  │     │ Next.js  │     │ Next.js  │
   │ Stateless│     │ Stateless│     │ Stateless│
   └────┬─────┘     └────┬─────┘     └────┬─────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    Redis    │
                  │ Shared Cache│
                  └─────────────┘
```

**Request Flow:**

```
User Request 1: Get /products
→ Load Balancer → Server 1
→ Check Redis → Cache Miss
→ Query DB → Store in Redis
→ Response (slow: 500ms)

User Request 2: Get /products (SAME DATA!)
→ Load Balancer → Server 2
→ Check Redis → Cache HIT ✅
→ Return from Redis (no DB query)
→ Response (fast: 50ms)

User Request 3: Get /products (SAME DATA!)
→ Load Balancer → Server 3
→ Check Redis → Cache HIT ✅
→ Return from Redis (no DB query)
→ Response (fast: 50ms)
```

**Result:** 3 requests = 1 DB query! 🚀

---

## Why We Destroy Containers in CI/CD

### The Container Immutability Principle

Docker containers are designed to be **immutable** (unchangeable). Here's why we destroy and recreate:

### ❌ Why We DON'T Update Running Containers

```bash
# This is WRONG:
docker exec my-app git pull        # Pull new code
docker exec my-app npm install     # Install deps
docker exec my-app pm2 restart     # Restart app

# Problems:
❌ Old files remain (zombie code)
❌ Dependencies might conflict
❌ Environment might be dirty
❌ Hard to reproduce issues
❌ "It works on my machine" syndrome
```

### ✅ Why We DO Destroy and Recreate

```bash
# This is CORRECT:
docker build -t my-app:v2 .        # Build fresh image
docker stop my-app                 # Stop old container
docker rm my-app                   # Remove old container
docker run my-app:v2               # Start new container

# Benefits:
✅ Clean slate every time
✅ Reproducible environment
✅ No leftover files
✅ Consistent across all servers
✅ Easy rollback (just run old image)
```

### Real CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Build new image
      - name: Build Docker Image
        run: docker build -t my-app:${{ github.sha }} .
      
      # 2. Push to registry
      - name: Push to ECR
        run: docker push my-app:${{ github.sha }}
      
      # 3. Deploy to EC2
      - name: Deploy
        run: |
          ssh ec2-user@my-server "
            # Pull new image
            docker pull my-app:${{ github.sha }}
            
            # Stop old container (cache lost here!)
            docker stop my-app
            docker rm my-app
            
            # Start new container
            docker run -d \
              --name my-app \
              --env-file .env \
              my-app:${{ github.sha }}
          "
```

**What happens to cache:**

```
Time: 10:00:00 - Build starts
Time: 10:02:00 - New image built
Time: 10:03:00 - Old container stopped  ← Cache DELETED
Time: 10:03:01 - Old container removed
Time: 10:03:02 - New container starts   ← Cache EMPTY
Time: 10:03:05 - App ready, but cold cache
```

**With Redis added:**

```yaml
# docker-compose.yml on EC2 server

version: '3.8'

services:
  nextjs:
    image: my-app:${VERSION}
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data  # Persists across deployments
    restart: unless-stopped

volumes:
  redis-data:
    driver: local
```

**Updated deployment:**

```bash
# Deploy script
docker-compose pull nextjs    # Pull new Next.js image
docker-compose up -d nextjs   # Recreate ONLY Next.js
                              # Redis keeps running!

# Result:
# - Next.js container destroyed & recreated
# - Redis container untouched
# - Cache survives! ✅
```

---

## When You Need Redis

### ✅ You NEED Redis if:

| Scenario | Why Redis Needed |
|----------|------------------|
| **Multiple servers** (load balanced) | Shared cache across instances |
| **Frequent deployments** (10+ times/day) | Cache survives deploys |
| **High traffic** (10k+ requests/min) | Reduce DB load |
| **Expensive queries** (complex joins, aggregations) | Cache prevents repeated expensive operations |
| **External API calls** (with rate limits) | Avoid hitting rate limits |
| **Blue-Green deployments** | Both environments share cache |

### ❌ You DON'T Need Redis if:

| Scenario | Why Next.js Cache is Fine |
|----------|---------------------------|
| **Single server** (1 EC2 instance, no scaling) | No cache fragmentation issue |
| **Rare deployments** (once per week) | Cache rebuild acceptable |
| **Low traffic** (<1k requests/min) | DB can handle load |
| **Simple queries** (fast selects) | Query speed acceptable |
| **Static/mostly-static site** | Next.js cache + ISR sufficient |

---

## Cost-Benefit Analysis

### Small App (Single Server, Low Traffic)

**Without Redis:**
```
Costs:
- 1 EC2 t3.small: $15/month

Deploy Impact:
- 30 second cold cache period
- 100 users affected
- Acceptable downtime
```

**With Redis:**
```
Costs:
- 1 EC2 t3.small: $15/month
- 1 ElastiCache Redis: $15/month
- Total: $30/month (+100% cost)

Benefit:
- Minimal improvement for low traffic
- Not worth the extra cost
```

**Verdict:** ❌ Don't use Redis

### Large App (Multi-Server, High Traffic)

**Without Redis:**
```
Costs:
- 3 EC2 t3.medium: $90/month
- Database overload → upgrade to larger instance: +$50/month
- Total: $140/month

Deploy Impact:
- 5 minute cold cache period
- 10,000 users affected
- Database spike causes errors
```

**With Redis:**
```
Costs:
- 3 EC2 t3.medium: $90/month
- 1 ElastiCache Redis (cache.r6g.large): $60/month
- Total: $150/month (+7% cost)

Benefit:
- Zero downtime deploys
- 80% reduction in DB queries
- Can use smaller database: -$30/month
- Net cost: $120/month (saves $20!)
```

**Verdict:** ✅ Use Redis

---

## Redis Setup Example

### Docker Compose (Single Server)

```yaml
version: '3.8'

services:
  nextjs:
    image: my-nextjs-app
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=production
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    restart: unless-stopped
    # Optional: Add password
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  redis-data:
    driver: local
```

### Next.js Cache Integration

```typescript
// lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache wrapper for any function
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Check cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch data
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

// Usage in Server Component
export default async function ProductsPage() {
  const products = await getCached(
    'featured-products',
    async () => {
      return db.select()
        .from(products)
        .where(eq(products.featured, true))
        .limit(10);
    },
    300 // 5 minutes TTL
  );

  return <ProductGrid products={products} />;
}
```

---

## Summary

### Key Takeaways

1. **Next.js cache lives in containers** → Dies with deployments
2. **CI/CD always destroys containers** → Immutability principle
3. **Redis cache lives separately** → Survives deployments
4. **Multi-server = fragmented cache** → Redis needed for sharing
5. **Small apps don't need Redis** → Extra cost, minimal benefit
6. **Large apps benefit from Redis** → Actually saves money

### Decision Tree

```
Do you have multiple servers?
├─ YES → Use Redis ✅
└─ NO → Do you deploy frequently (10+ times/day)?
    ├─ YES → Use Redis ✅
    └─ NO → Is traffic high (10k+ req/min)?
        ├─ YES → Use Redis ✅
        └─ NO → Next.js cache is fine ❌
```

---

## Further Reading

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Docker Container Lifecycle](https://docs.docker.com/engine/reference/run/)
- [Redis Persistence](https://redis.io/docs/management/persistence/)
- [AWS ElastiCache Best Practices](https://docs.aws.amazon.com/elasticache/)