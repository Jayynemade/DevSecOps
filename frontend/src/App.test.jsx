// import { render, screen, waitFor } from '@testing-library/react'
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import axios from 'axios'
// import App from './App'

// vi.mock('axios')

// describe('App', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//     vi.mocked(axios.get).mockResolvedValue({
//       data: { message: 'Hello from Node Backend' },
//     })
//   })

//   it('renders the page heading', () => {
//     render(<App />)

//     expect(screen.getByRole('heading', { level: 1, name: 'React Frontend' })).toBeInTheDocument()
//   })

//   it('fetches and displays the backend message', async () => {
//     render(<App />)

//     await waitFor(() => {
//       expect(screen.getByRole('heading', { level: 2, name: 'Hello from Node Backend' })).toBeInTheDocument()
//     })

//     expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/message')
//     expect(axios.get).toHaveBeenCalledTimes(1)
//   })

//   it('starts with an empty message before the API responds', () => {
//     vi.mocked(axios.get).mockReturnValue(new Promise(() => {}))

//     const { container } = render(<App />)

//     expect(container.querySelector('h2')).toHaveTextContent('')
//   })
// })
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import App from "./App";

vi.mock("axios");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page heading and subtitle", () => {
    vi.mocked(axios.get).mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "React × Express",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "A simple frontend communicating with your backend API."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Backend Connected")).toBeInTheDocument();
  });

  it("shows loading message before the API responds", () => {
    vi.mocked(axios.get).mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Loading...",
      })
    ).toBeInTheDocument();
  });

  it("fetches and displays the backend message", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        message: "Hello from Node Backend",
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "Hello from Node Backend",
        })
      ).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/message"
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("shows an error message when the API request fails", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network Error"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "Unable to connect to server.",
        })
      ).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});