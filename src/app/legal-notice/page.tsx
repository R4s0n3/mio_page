export default function LegalNotice() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 bg-gradient-to-b from-primary-800 to-primary-900 py-20 font-text text-headings">
      <div className="container flex flex-col items-center justify-center">
        <h1 className="font-headline text-6xl">Legal Notice</h1>
        <br />
        <h2 className="font-subhead text-2xl">Site Owner</h2>
        <p>Mio Mideal</p>
        <br />
        <h2 className="font-subhead text-2xl">Contact</h2>
        <p>legal@miomideal.com</p>
        <br />
        <h2 className="font-subhead text-2xl">Responsible for Content:</h2>
        <p>Hein Schoenen GbR</p>
        <p>Blumenstraße 43, 66111 SB</p>
        <br />
        <h2 className="font-subhead text-2xl">Registration Details:</h2>
        <p>040 155 15 215</p>
      </div>
    </main>
  );
}
