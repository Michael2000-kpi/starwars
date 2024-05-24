import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

describe("Card component", () => {
  const mockPerson = {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
  };

  test("renders back button", () => {
    const handleBack = jest.fn();
    render(<Card person={mockPerson} onBack={handleBack} />);
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  test("renders person details", () => {
    render(<Card person={mockPerson} />);
    expect(screen.getByText("Name: Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Height: 172")).toBeInTheDocument();
    expect(screen.getByText("Mass: 77")).toBeInTheDocument();
    expect(screen.getByText("Hair Color: blond")).toBeInTheDocument();
    expect(screen.getByText("Skin Color: fair")).toBeInTheDocument();
    expect(screen.getByText("Eye Color: blue")).toBeInTheDocument();
    expect(screen.getByText("Birth Year: 19BBY")).toBeInTheDocument();
    expect(screen.getByText("Gender: male")).toBeInTheDocument();
  });

  test("calls onBack when back button is clicked", () => {
    const handleBack = jest.fn();
    render(<Card person={mockPerson} onBack={handleBack} />);
    const backButton = screen.getByRole("button", { name: /back/i });
    userEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
