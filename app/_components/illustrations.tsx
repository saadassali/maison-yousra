// Dessins décoratifs en CSS (aria-hidden) : des contenants standards avec une étiquette au nom
// du client. Ils tiennent la place des photos tant qu'aucune n'a son accord (prompt 0, règle 3),
// sans rien prétendre montrer de réel.

type Props = { className?: string };

export function Flacon({
  nom = "Votre établissement",
  mention = "× Coopérative",
  petit = false,
  className = "",
}: Props & { nom?: string; mention?: string; petit?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center ${className}`}>
      <div className={`rounded-t-[3px] bg-cedre ${petit ? "h-6 w-5" : "h-[34px] w-[26px]"}`} />
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-[14px] border border-trait bg-lin px-3 text-center ${petit ? "h-[176px] w-[96px]" : "h-[250px] w-[130px]"}`}
      >
        <div className="flex h-6 w-14 items-center justify-center border border-dashed border-sourdine text-[9px] tracking-widest text-sourdine">
          LOGO
        </div>
        <div className={`font-display leading-tight ${petit ? "text-[14px]" : "text-[17px]"}`}>{nom}</div>
        <div className="text-[9px] uppercase tracking-[0.12em] text-sourdine">{mention}</div>
      </div>
    </div>
  );
}

export function Recharge({ className = "" }: Props) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center ${className}`}>
      <div className="h-[18px] w-[34px] rounded-t-[3px] bg-cedre" />
      <div className="flex h-[150px] w-[118px] flex-col items-center justify-center gap-2 rounded-[8px_8px_4px_4px] border border-trait bg-lin">
        <div className="flex h-6 w-12 items-center justify-center border border-dashed border-sourdine text-[8px] tracking-widest text-sourdine">
          LOGO
        </div>
        <div className="text-[10px] text-sourdine">5 L</div>
      </div>
    </div>
  );
}

export function Savon({ className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-[60px] w-[96px] items-center justify-center rounded-[4px] bg-safran text-center text-[10px] font-semibold leading-tight ${className}`}
    >
      Savon
      <br />
      solide
    </div>
  );
}

export function Pot({ className = "" }: Props) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center ${className}`}>
      <div className="h-[22px] w-[112px] rounded-t-[6px] bg-cedre" />
      <div className="flex h-[96px] w-[104px] flex-col items-center justify-center gap-1 rounded-b-[10px] border border-trait bg-lin">
        <div className="font-display text-[14px]">Votre spa</div>
        <div className="text-[8px] uppercase tracking-[0.12em] text-sourdine">savon noir · 1 kg</div>
      </div>
    </div>
  );
}

export function Coffret({ nom = "Votre nom", className = "" }: Props & { nom?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-[110px] w-[150px] flex-col items-center justify-center gap-1.5 rounded-[4px] bg-indigo text-lin ${className}`}
    >
      <div className="flex h-5 w-12 items-center justify-center border border-dashed border-[#c9cfe4] text-[8px] tracking-widest">
        LOGO
      </div>
      <div className="font-display text-[14px]">{nom}</div>
    </div>
  );
}

/** L'arche du canevas, qui accueille un dessin (ou, plus tard, une photo). */
export function Niche({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`arche flex items-end justify-center gap-5 pb-10 ${className}`}>{children}</div>
  );
}
