import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const isActive: (path: string) => boolean = (path) =>
    router.pathname === path;
  const { data: session, status, ...rest } = useSession();

  let left = (
    <div className="left">
      <Link className="bold" data-active={isActive("/")} href="/">
        Home
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }
        a {
          text-decoration: none;
          color: #0366d6;
          display: inline-block;
        }
        .left a[data-active="true"] {
          color: gray;
        }
        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
  let right = null;

  if (status === "loading") {
    left = (
      <div className="left">
        <Link className="bold" data-active={isActive("/")} href="/">
          Home
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }
          a {
            text-decoration: none;
            color: #0366d6;
            display: inline-block;
          }
          .left a[data-active="true"] {
            color: gray;
          }
          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }
  if (!session) {
    right = (
      <div className="right">
        <Link data-active={isActive("/signup")} href="/api/auth/signin">
          Log in
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #0366d6;
            display: inline-block;
          }
          a + a {
            margin-left: 1rem;
          }
          .right {
            margin-left: auto;
          }
          .right a {
            border: 1px solid #0366d6;
            border-radius: 3px;
            padding: 0.5rem 1rem;
          }
        `}</style>
      </div>
    );
  }
  if (session) {
    left = (
      <div className="left">
        <Link className="bold" data-active={isActive("/")} href="/">
          Feed
        </Link>
        <Link data-active={isActive("/drafts")} href="/drafts">
          My drafts
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #0366d6;
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user?.name} ({session.user?.email})
        </p>
        <Link href="/create">New post</Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #0366d6;
            display: inline-block;
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid #0366d6;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <nav>
        {left}
        {right}
        <style jsx>{`
          nav {
            display: flex;
            align-items: center;
            padding: 2rem;
          }
        `}</style>
      </nav>
      <div>{JSON.stringify(status)}</div>
      <button onClick={() => console.log(status, session)}>TEST</button>
    </>
  );
};
