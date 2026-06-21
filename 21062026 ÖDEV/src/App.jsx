import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Offer from "./components/Offer";
import ProjectDetail from "./components/ProjectDetail";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "İstanbul",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      description:
        "Modern çizgilere sahip lüks villa iç mimari projesi."
    },
    {
      id: 2,
      title: "Boutique Hotel",
      location: "İzmir",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      description:
        "Butik otel konsept tasarım ve uygulama projesi."
    },
    {
      id: 3,
      title: "Corporate Office",
      location: "Ankara",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      description:
        "Kurumsal ofis tasarımı ve uygulaması."
    }
  ];

  return (
    <>
      <Header setPage={setPage} />

      {page === "home" && (
        <Home setPage={setPage} />
      )}

      {page === "about" && (
        <About />
      )}

      {page === "projects" && (
        <Projects
          projects={projects}
          setPage={setPage}
          setSelectedProject={setSelectedProject}
        />
      )}

      {page === "projectDetail" && (
        <ProjectDetail
          project={selectedProject}
        />
      )}

      {page === "offer" && (
        <Offer />
      )}

      {page === "contact" && (
        <Contact />
      )}

      <Footer setPage={setPage} />
    </>
  );
}