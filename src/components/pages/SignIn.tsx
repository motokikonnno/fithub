import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import Image from "next/image";
import React, { FC } from "react";
import styles from "../../styles/components/pages/SignIn.module.scss";

export type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export const SignIn: FC<SignInProps> = React.memo(({ providers }) => {
  return (
    <div className={styles.elem}>
      <div className={styles.inner}>
        <div className={styles.layoutContainer}>
          <Image
            src={"/logo.png"}
            width={48}
            height={48}
            alt="logo-icon"
            className={styles.logoIcon}
          />
          <h1 className={styles.title}>Sign in to FitHub</h1>
          <div className={styles.signInButtonContainer}>
            {providers &&
              Object.values(providers).map((provider) => {
                return (
                  <button
                    key={provider.id}
                    className={styles.signInButton}
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  >
                    <Image
                      src={`/icons/${provider.id}.svg`}
                      width={24}
                      height={24}
                      alt="service-icon"
                      className={styles.serviceIcon}
                    />
                    Sign in with {provider.name}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
});
