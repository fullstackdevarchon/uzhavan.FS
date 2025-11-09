import { Navbar, Main, Product, Footer } from "../components";
import PageContainer from "../components/PageContainer";

function Home() {
  return (
    <PageContainer>
      <Navbar />
      <Main />
      <Product />
      <Footer />
    </PageContainer>
  )
}

export default Home