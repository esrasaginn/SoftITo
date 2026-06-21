export default function ProjectDetail({ project }) {

  if (!project) {
    return (
      <section className="project-detail">
        <h2>Proje Bulunamadı</h2>
      </section>
    );
  }

  return (
    <>
      <section className="project-detail">

        <div className="container">

          <img
            src={project.image}
            alt={project.title}
            className="detail-image"
          />

          <h1>{project.title}</h1>

          <p className="detail-location">
            {project.location}
          </p>

          <p className="detail-description">
            {project.description}
          </p>

        </div>

      </section>
    </>
  );
}