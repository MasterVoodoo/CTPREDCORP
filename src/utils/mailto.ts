const COMPANY_EMAIL = "aseantower@ctpred.com.ph";

type MailtoOptions = {
  to?: string;
  cc?: string;
  subject: string;
  body: string;
};

export const formatMailDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const buildMailtoLink = ({
  to = COMPANY_EMAIL,
  cc,
  subject,
  body,
}: MailtoOptions) => {
  const params = [
    ["subject", subject],
    ["body", body],
  ];

  if (cc) {
    params.push(["cc", cc]);
  }

  const query = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `mailto:${to}?${query}`;
};

export { COMPANY_EMAIL };
