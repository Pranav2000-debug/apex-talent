import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </SignedIn>
      <UserButton />
    </div>
  );
}

export default App;
