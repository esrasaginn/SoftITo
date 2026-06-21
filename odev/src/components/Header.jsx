export default function Header({setPage}){

    return(
        <>
        <header className="header">

        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          Artemis Architecture & Interior
        </div>

        <nav>
          <ul className="nav-links">
            <li onClick={() => setPage("home")}>
              Anasayfa
            </li>

            <li onClick={() => setPage("about")}>
              Hakkımızda
            </li>

            <li onClick={() => setPage("projects")}>
              Projeler
            </li>

            <li onClick={() => setPage("offer")}>
              Teklif Al
            </li>

            <li onClick={() => setPage("contact")}>
              İletişim
            </li>
          </ul>
        </nav>

      </header>
        
        </>
    )
}
   