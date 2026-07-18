export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white/70 leading-relaxed space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-white/40 text-sm">Last updated: July 2026</p>
      </div>

      <p>
        Andrews Chapel A.M.E. Zion Church (&quot;Andrews Chapel,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy
        and is committed to protecting the personal information you share with us through our website. This
        policy explains what information we collect, how we use it, and the choices you have.
      </p>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Information We Collect</h2>
        <p>We collect information you voluntarily provide when you:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Fill out a Visitor Card (name, email, phone, address, birthdate, and interests)</li>
          <li>Apply for church membership (name, email, phone, birthdate, address, and testimony)</li>
          <li>Submit a prayer request or praise report (name or anonymous submission, and your message)</li>
          <li>Message Pastor Kathy Grace directly (name or anonymous, email, phone, and your message)</li>
          <li>Sign up for a Connect Group (name, email, and phone)</li>
          <li>Create a Member Portal account (name, email, phone, and password)</li>
          <li>Make a donation through our Give page</li>
        </ul>
        <p>
          If you create a Member Portal account, you may also choose whether to share your name, email, and/or
          phone number in our internal member directory, visible only to other approved, signed-in members. This
          is entirely optional and can be changed at any time from your account settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">How We Use Your Information</h2>
        <p>We use the information you provide to:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Respond to your messages, prayer requests, and inquiries</li>
          <li>Process membership applications and visitor follow-up</li>
          <li>Send administrative emails, such as account confirmations and password resets</li>
          <li>Maintain our internal member directory, according to your sharing preferences</li>
          <li>Improve our website and the ministries we offer</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third parties for marketing purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Third-Party Services</h2>
        <p>
          To operate our website, we rely on a small number of trusted service providers who process data on
          our behalf:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li><strong className="text-white/90">Supabase</strong> — securely stores form submissions and account information</li>
          <li><strong className="text-white/90">Resend</strong> — delivers transactional emails, such as account confirmations</li>
          <li><strong className="text-white/90">Cloudflare Turnstile</strong> — helps protect our forms from spam and automated abuse</li>
          <li><strong className="text-white/90">Vercel</strong> — hosts our website and provides basic, privacy-friendly usage analytics</li>
        </ul>
        <p>
          These providers only receive the information necessary to perform their specific function and are not
          permitted to use it for their own purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Who Can Access Your Information</h2>
        <p>
          Form submissions (prayer requests, visitor cards, membership applications, and messages) are only
          visible to authorized church staff — specifically our pastor and designated administrators — through
          a secured, password-protected system.
        </p>
        <p>
          Prayer requests and praise reports are only shown publicly on our website if you choose to make them
          visible, and only after staff approval. You may always choose to keep a request private or submit it
          anonymously.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Data Retention</h2>
        <p>
          We retain your information for as long as needed to fulfill the purposes described in this policy, or
          as long as you maintain an active relationship with Andrews Chapel. You may request that we delete
          your information at any time by contacting us using the information below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Children&apos;s Privacy</h2>
        <p>
          Our website is intended for general church use and is not directed at children under 13. We do not
          knowingly collect personal information from children without parental involvement (for example,
          through a family visitor card or membership application submitted by a parent or guardian).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Your Choices</h2>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>You may decline to provide certain information, though this may limit our ability to respond to you</li>
          <li>You may submit prayer requests and messages anonymously</li>
          <li>You may opt in or out of the member directory at any time from your account settings</li>
          <li>You may request access to, correction of, or deletion of your personal information</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or how your information is handled, please contact us:
        </p>
        <div className="space-y-1 mt-2">
          <p>Andrews Chapel A.M.E. Zion Church</p>
          <p>3009 McLean Chapel Church Rd, Bunnlevel, NC 28323</p>
          <p>
            <a href="tel:9108935162" className="text-[#D4AF37] hover:opacity-80 transition-opacity">(910) 893-5162</a>
          </p>
          <p>
            <a href="mailto:contact@andrewschapelame.org" className="text-[#D4AF37] hover:opacity-80 transition-opacity">contact@andrewschapelame.org</a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other
          operational, legal, or regulatory reasons. The &quot;Last updated&quot; date at the top of this page reflects
          the most recent revision.
        </p>
      </section>
    </div>
  );
}
