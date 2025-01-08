import "../style.css";

import Markdown from "../../[locale]/(default)/_components/markdown";
import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service",
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/terms-of-service`,
    },
  };
}

export default function () {
  const content = `# SleepingMusic.com Terms of Service

Effective Date: April 8, 2024

Thank you for choosing SleepingMusic.com. These Terms of Service ("Terms") are a legal agreement between you and SleepingMusic.com and govern your use of the SleepingMusic.com services including our website, mobile apps, and other features or services (collectively, the "Service"). By using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use the Service.

## 1. Acceptance of Terms

By accessing or using the Service, you confirm your acceptance of these Terms and agree to be bound by them. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these Terms.

## 2. Changes to Terms

SleepingMusic.com reserves the right, at its sole discretion, to modify or replace the Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

## 3. Use of the Service

### Account Registration

You may be required to register for an account to access certain features of the Service. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.

### User Conduct

You are responsible for all your activity in connection with the Service. Any fraudulent, abusive, or otherwise illegal activity may be grounds for termination of your right to access or use the Service.

### Intellectual Property

All content provided on the Service, including the design, text, graphics, logos, icons, images, and the selection and arrangement thereof, is the exclusive property of SleepingMusic.com or its licensors and is protected by U.S. and international copyright laws.

## 4. Content

### User-Generated Content

You may be able to upload, store, or share content through the Service. You retain all rights in, and are solely responsible for, the user-generated content you post to SleepingMusic.com.

### Content Use

By posting content on the Service, you grant SleepingMusic.com a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, translate, format, publish, transmit, display, and distribute such content in any and all media or distribution methods (now known or later developed).

## 5. Disclaimers

SleepingMusic.com provides the Service on an "as is" and "as available" basis. You therefore use the Service at your own risk. SleepingMusic.com expressly disclaims any and all warranties of any kind, whether express or implied.

## 6. Limitation of Liability

To the fullest extent permitted by law, in no event will SleepingMusic.com, its officers, shareholders, employees, agents, directors, subsidiaries, affiliates, successors, assigns, suppliers, or licensors be liable for (1) any indirect, special, incidental, punitive, exemplary, or consequential damages; (2) any loss of use, data, business, or profits (whether direct or indirect), in all cases arising out of the use or inability to use the Service, regardless of legal theory, without regard to whether SleepingMusic.com has been warned of the possibility of those damages, and even if a remedy fails of its essential purpose.

## 7. General

These Terms are governed by the laws of the jurisdiction in which SleepingMusic.com is located, without regard to its conflict of laws rules. The courts in some countries will not apply these jurisdiction's laws to some types of disputes. If you reside in one of those countries, then where these jurisdiction's laws are required to apply, the laws of your resident country will apply to such disputes related to these Terms.

## Contact Us

If you have any questions about these Terms, please contact us at [calkinzybjog@gmail.com](mailto:calkinzybjog@gmail.com). 
`;

  return (
    <div>
      <a className="text-base-content cursor-pointer" href="/">
        <MdOutlineHome className="text-2xl mx-8 my-8" />
        {/* <img className="w-10 h-10 mx-4 my-4" src="/sleeping-music-logo.png" /> */}
      </a>
      <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
        <Markdown content={content} />
      </div>
    </div>
  );
}
