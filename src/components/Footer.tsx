import { AlbyLogo } from "../components/icons/AlbyLogo";

export function Footer() {
  return (
    <div className="mb-4 flex w-full justify-center items-center gap-1">
      <span className="block text-sm">Made with love by</span>
      <AlbyLogo className="w-12 h-6" />
    </div>
  );
}
