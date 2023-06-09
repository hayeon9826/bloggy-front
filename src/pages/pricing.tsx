import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Header from "@/components/Header";
import useAmplitude from "@/hooks/useAmplitude";
import { Layout } from "@/components";
import { useSession } from "next-auth/react";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];
const tiers = [
  {
    name: "Free",
    id: "tier-freelancer",
    href: "#",
    price: { monthly: "$15", annually: "$144" },
    description: "The essentials to provide your best work for clients.",
    features: ["5 products", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"],
    mostPopular: false,
    buttonText: "Get Started",
  },
  {
    name: "Paid",
    id: "tier-startup",
    href: "#",
    price: { monthly: "$30", annually: "$288" },
    description: "A plan that scales with your rapidly growing business.",
    features: ["25 products", "Up to 10,000 subscribers", "Advanced analytics", "24-hour support response time", "Marketing automations"],
    mostPopular: true,
    buttonText: "Buy Plan",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const { data: session } = useSession();
  const [frequency, setFrequency] = useState(frequencies[0]);
  const { amplitude } = useAmplitude({ session });

  useEffect(() => {
    amplitude.track(`pricing_page`);
  }, [amplitude]);

  return (
    <>
      <Layout>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-54l">Pricing plans for teams of&nbsp;all&nbsp;sizes</p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
              Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
            </p>
            {/* <div className="mt-16 flex justify-center">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            >
              <RadioGroup.Label className="sr-only">
                Payment frequency
              </RadioGroup.Label>
              {frequencies.map((option) => (
                <RadioGroup.Option
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                      checked ? "bg-indigo-600 text-white" : "text-gray-500",
                      "cursor-pointer rounded-full px-2.5 py-1"
                    )
                  }
                >
                  <span>{option.label}</span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div> */}
            <div className="isolate mx-auto mt-20 flex justify-center gap-8">
              {tiers.map((tier) => (
                <div key={tier.id} className={classNames(tier.mostPopular ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200", "rounded-3xl p-8 xl:p-10")}>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 id={tier.id} className={classNames(tier.mostPopular ? "text-indigo-600" : "text-gray-900", "text-lg font-semibold leading-8")}>
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                      <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">Most popular</p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    {/* <span className="text-4xl font-bold tracking-tight text-gray-900">{tier?.price?.[frequency?.value]}</span> */}
                    <span className="text-sm font-semibold leading-6 text-gray-600">{/* {frequency.priceSuffix} */}</span>
                  </p>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                        : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                      "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    {tier.buttonText}
                  </a>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
