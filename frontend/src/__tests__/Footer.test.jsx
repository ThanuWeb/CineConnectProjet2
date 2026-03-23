import { render } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer", () => {
  it("devrait se rendre sans erreur", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
