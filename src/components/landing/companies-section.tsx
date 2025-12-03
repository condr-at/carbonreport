import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import Image from "next/image";

const COMPANIES = [
  { name: "Partner 1", logo: "/app/emblem-black.svg" },
  { name: "Partner 2", logo: "/app/emblem-black.svg" },
  { name: "Partner 3", logo: "/app/emblem-black.svg" },
  { name: "Partner 4", logo: "/app/emblem-black.svg" },
  { name: "Partner 5", logo: "/app/emblem-black.svg" },
] as const;

export function CompaniesSection() {
  return (
    <MaxWidthWrapper>
      <AnimationContainer delay={0.4}>
        <div className="py-14">
          <div className="mx-auto px-4 md:px-8">
            <h2 className="text-center text-sm font-medium font-heading text-muted-foreground uppercase">
              Trusted by leading organizations
            </h2>
            <div className="mt-8">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-16 justify-center">
                {COMPANIES.map((company) => (
                  <li key={company.name}>
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={80}
                      height={80}
                      quality={100}
                      className="w-28 h-auto dark:hidden"
                    />
                    <Image
                      src="/app/emblem-white.svg"
                      alt={company.name}
                      width={80}
                      height={80}
                      quality={100}
                      className="w-28 h-auto hidden dark:block"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
}
