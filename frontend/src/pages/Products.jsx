import React from 'react'
import { Footer, Navbar, Product } from "../components"
import PageContainer from "../components/PageContainer"

const Products = () => {
  return (
    <PageContainer>
      <Navbar />
      <Product />
      <Footer />
    </PageContainer>
  )
}

export default Products