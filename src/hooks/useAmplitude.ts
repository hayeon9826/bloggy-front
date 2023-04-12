import * as amplitude from "@amplitude/analytics-browser";

interface AmplitudeProps {
  session?: any;
}

export default function useAmplitude({ session }: AmplitudeProps) {
  const SESSION_EMAIL = session?.user?.email;
  // amplitude.init(process.env.AMPLITUDE_KEY as string, SESSION_EMAIL, {
  //   defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
  // });
  return {
    amplitude,
  };
}
