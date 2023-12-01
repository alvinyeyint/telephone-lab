import { LinkButton } from "@/components/Base/Button";
import { Center } from "@/components/Base/Center";

const links = [
  { pathname: "/mizu", children: "Mizu SDK" },
  { pathname: "/yeastar", children: "Linkus SDK" },
  { pathname: "/linkus", children: "Linkus SDK (NEW)" },
];

export default function Home() {
  return (
    <Center>
      <article className="flex items-center justify-center gap-8">
        {links.map((link) => (
          <LinkButton key={link.pathname} href={{ pathname: link.pathname }}>
            {link.children}
          </LinkButton>
        ))}
      </article>
    </Center>
  );
}
