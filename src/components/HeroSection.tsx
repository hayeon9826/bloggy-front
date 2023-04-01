import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  PencilIcon,
  CheckBadgeIcon,
  ChartPieIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Write Faster.",
    description:
      "Fill in the title and click 'Create blog post' button. ChatGPT is ready to create an awesome article for you.",
    icon: PencilIcon,
  },
  {
    name: "Trusty Enhancement.",
    description:
      "You could also enhance the article with 'Enhancement' feature. It automatically check all the grammar, vocabulary and paraphrase.",
    icon: CheckBadgeIcon,
  },
  {
    name: "Quick Summarize.",
    description:
      "If you want to summarize the paragraph, let text-davinci-003 do the work in a minute.",
    icon: ChartPieIcon,
  },
];

export default function HeroSection() {
  return (
    <div className="overflow-hidden mt-20 sm:mt-0 pt-24 sm:pt-32 bg-purple-200 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-black">
                Write Faster
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A better workflow
              </p>
              <p className="mt-6 text-lg leading-7 text-black">
                Write your blog article with ChatGPT text-davinci-003. It will
                write a proposal in one minute just as you fill in the title.
                What{`'`}s more, AI could do the paraphrase, enhancement, and
                summary for you.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-black lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-black"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            src="/images/bloggy-editor.png"
            alt="Product screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  );
}
