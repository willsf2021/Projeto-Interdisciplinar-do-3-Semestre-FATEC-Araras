from weasyprint import HTML, CSS

BASE_PATH = 'C:/Users/wills/OneDrive/Documentos/projetoIntegrador3sem/weasy_print/'



vertical = """
    @page {
        margin: 2cm;
        size: A4;
    }
    
    * {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }
      
      body {
        height: 100vh;
        width: 100vw;
        display:flex;
        align-items: center;
        justify-content: center;
      }
      
      main {
        border: 2px solid black;
        padding: 8px;
        max-width: fit-content;
        h1 {
          text-align: center;
          font-size: 26px;
          font-weight: 600;
        }
      }
      p {
        font-size: 22px;
        white-space: nowrap;
      }
      #hr {
        height: 2px;
        background-color: black;
      }
      #hr2 {
        height: 8px;
        background-color: black;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse; 
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }
      
      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }
    """
horizontal = """
    @page {
        margin: 2cm;
        size: A4;
    }
    
          * {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }

      body {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      main {
        border: 2px solid black;
        padding: 8px;
        max-width: min-content;
        display: flex;
        column-gap: 12px;

        h1 {
          text-align: left;
          font-size: 26px;
          font-weight: 600;
        }
      }

      header {
        width: 187px;
      }

      p {
        font-size: 22px;
      }

      .th p {
        white-space: nowrap;
      }
      #hr {
        height: 8px;
        background-color: black;
      }
      #hr2 {
        display: none;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }
    """
    
css_doc1 = CSS(string=vertical)
css_doc2 = CSS(string=horizontal)

HTML(f"{BASE_PATH}rotulo.html").write_pdf(f"{BASE_PATH}vertical.pdf", stylesheets=[css_doc1])
HTML(f"{BASE_PATH}rotulo.html").write_pdf(f"{BASE_PATH}horizontal.pdf", stylesheets=[css_doc2])