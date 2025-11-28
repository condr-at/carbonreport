import Link from "next/link";
import AnimationContainer from "../global/animation-container";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32">
      <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

      <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-start justify-start md:max-w-[200px]">
            <div className="flex items-start gap-2">
              <Image
                src="/app/emblem-black.svg"
                alt="Carbon Report"
                width={28}
                height={28}
                className="dark:hidden"
              />
              <Image
                src="/app/emblem-white.svg"
                alt="Carbon Report"
                width={28}
                height={28}
                className="hidden dark:block"
              />
            </div>
            <p className="text-muted-foreground mt-4 text-sm text-start">
              Track and reduce your carbon footprint with ease.
            </p>
          </div>
        </AnimationContainer>

        <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.2}>
              <div className="">
                <h3 className="text-base font-medium text-foreground">
                  Product
                </h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="mt-2">
                    <Link
                      href="/#features"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Features
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/#pricing"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/#faq"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
            <AnimationContainer delay={0.3}>
              <div className="mt-10 md:mt-0 flex flex-col">
                <h3 className="text-base font-medium text-foreground">
                  Company
                </h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="mt-2">
                    <Link
                      href="/about"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      About
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/blog"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/contact"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.4}>
              <div className="">
                <h3 className="text-base font-medium text-foreground">
                  Legal
                </h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="mt-2">
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
        <AnimationContainer delay={0.6}>
          <p className="text-sm text-muted-foreground mt-8 md:mt-0">
            &copy; {new Date().getFullYear()} Carbon Report. All rights
            reserved.
          </p>
        </AnimationContainer>
      </div>
    </footer>
  );
};

export default Footer;
