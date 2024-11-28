"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center p-4 ">
      <div className="w-full md:w-[30%] ">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="bg-card w-full p-6 rounded-md shadow-2xl flex flex-col gap-2 pb-6"
          >
            <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-center">
              <Image src="/azlanlogo.png" alt="" width={24} height={24} />
              Azlan ID Card
            </h1>
            <p className="text-center  mb-6">
              Sierra Leone Commercial Bike Riders
            </p>
            <h2 className="text-lg font-bold text-center">
              Sign in to your account
            </h2>
            <Clerk.GlobalError className="text-sm text-red-400" />
            <Clerk.Field name="identifier" className="flex flex-col gap-2 mb-4">
              <Clerk.Label className="text-md ">Email:</Clerk.Label>
              <Clerk.Input
                type="text"
                placeholder="Email. eg. abukeita@gmail.com"
                required
                className="p-3 rounded-sm ring-1 ring-gray-300"
              />
              <Clerk.FieldError className="text-xs text-red-400" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="bg-primary text-white my-1 rounded-md text-sm p-[10px]"
            >
              <Clerk.Loading>
                {(isLoading) => (isLoading ? "Loading..." : "Continue")}
              </Clerk.Loading>
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step
            name="verifications"
            className="bg-card w-full p-6 rounded-md shadow-2xl flex flex-col gap-2"
          >
            <SignIn.Strategy name="email_code">
              <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-center">
                <Image src="/azlanlogo.png" alt="" width={24} height={24} />
                Azlan ID Card
              </h1>
              <p className="text-center  mb-6">
                Sierra Leone Commercial Bike Riders
              </p>

              <h1 className="text-lg font-bold text-center">
                Check your email
              </h1>
              <p>
                We sent a code to <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code">
                <Clerk.Label>Email code</Clerk.Label>
                <Clerk.Input className="p-3 rounded-sm ring-1 ring-gray-300" />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>

              <SignIn.Action
                className="bg-primary text-white my-1 rounded-md text-sm p-[10px]"
                submit
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Continue")}
                </Clerk.Loading>
              </SignIn.Action>
            </SignIn.Strategy>

            <SignIn.Strategy name="password">
              <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-center">
                <Image src="/azlanlogo.png" alt="" width={24} height={24} />
                Azlan ID Card
              </h1>
              <p className="text-center  mb-6">
                Sierra Leone Commercial Bike Riders
              </p>
              <h2 className="text-lg font-bold text-center">
                Enter your password
              </h2>

              <Clerk.Field name="password" className="flex flex-col gap-2 mb-4">
                <Clerk.Label className="text-md ">Password:</Clerk.Label>
                <Clerk.Input
                  type="password"
                  placeholder="Enter Password"
                  required
                  className="p-3 rounded-sm ring-1 ring-gray-300"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="bg-primary text-white my-1 rounded-md text-sm p-[10px]"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Continue")}
                </Clerk.Loading>
              </SignIn.Action>
              <SignIn.Action
                navigate="forgot-password"
                className="text-blue-600"
              >
                Forgot password?
              </SignIn.Action>
            </SignIn.Strategy>

            <SignIn.Strategy name="reset_password_email_code">
              <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-center">
                <Image src="/azlanlogo.png" alt="" width={24} height={24} />
                Azlan ID Card
              </h1>
              <p className="text-center  mb-6">
                Sierra Leone Commercial Bike Riders
              </p>

              <h2 className="text-lg font-bold text-center">
                Check your email
              </h2>
              <p>
                We sent a code to <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code" className="flex flex-col gap-2 mb-4">
                <Clerk.Label>Email code</Clerk.Label>
                <Clerk.Input
                  placeholder="Enter code"
                  className="p-3 rounded-sm ring-1 ring-gray-300"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="bg-primary text-white my-1 rounded-md text-sm p-[10px]"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Continue")}
                </Clerk.Loading>
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>

          <SignIn.Step
            name="forgot-password"
            className="bg-card w-full p-6 rounded-md shadow-2xl flex flex-col gap-2"
          >
            <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-center">
              <Image src="/azlanlogo.png" alt="" width={24} height={24} />
              Azlan ID Card
            </h1>
            <p className="text-center  mb-6">
              Sierra Leone Commercial Bike Riders
            </p>
            <h1 className="text-lg font-bold text-center">
              Forgot your password?
            </h1>

            <SignIn.SupportedStrategy name="reset_password_email_code">
              <p className="text-blue-600">Reset password</p>
            </SignIn.SupportedStrategy>

            <SignIn.Action
              navigate="previous"
              className="bg-primary text-white my-1 rounded-md text-sm p-[10px]"
            >
              Go back
            </SignIn.Action>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default LoginPage;
