import { Backbar } from "../components/Backbar";
import { Footer } from "../components/Footer";

export function About() {
  return (
    <>
      <Backbar navigateTo={-1} />
      <div className="flex grow gap-5 flex-col justify-start items-center max-w-lg">
        <h1 className="text-xl">About</h1>
        <p>
          BuzzPay is a simple PoS powered by Nostr Wallet Connect. It has only limited access to
          your wallet: It can receive payments but not send them. Once you've connected your wallet
          can easily share your PoS link with your co-workers.
        </p>
        <p>BuzzPay also works great as a PWA. Try it out by saving it to your homescreen!</p>
        <p>After connecting to your wallet, bookmark the page to make sure you don't lose it.</p>
        <p>
          Do you have any feature requests, issues or would like to contribute?&nbsp;
          <a href="https://github.com/getAlby/pos" target="_blank" className="link">
            visit BuzzPay on Github
          </a>
          .
        </p>
      </div>
      <Footer />
    </>
  );
}
