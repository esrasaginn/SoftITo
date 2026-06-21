export default function Projects({
  projects,
  setPage,
  setSelectedProject
}) {
  return (
    <>
      <section className="projects">

        <div className="container">

          <h2 className="section-title">
            Projelerimiz
          </h2>

          <div className="project-grid">

            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => {
                  setSelectedProject(project);
                  setPage("projectDetail");
                }}
              >

                <img
                  src={project.image}
                  alt={project.title}
                />

                <div className="project-info">

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.location}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>
    </>
  );
}