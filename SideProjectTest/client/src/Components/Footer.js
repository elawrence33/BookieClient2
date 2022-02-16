import React from "react";
import {  Box,  Container,  Row,  Column,  FooterLink,  Heading,} from "./FooterStyles";
  
const Footer = () => {
  return (
    <Box>
      <Container>
          <Row>
            <Heading>Catalyst Campus Client Web Database</Heading>
            <FooterLink href="https:/www.catalystcampus.org">Catalyst Website</FooterLink>
            <FooterLink href="https://www.goodreads.com/quotes/tag/gandalf">    </FooterLink>
            </Row>
      </Container>
    </Box>
  );
};
export default Footer;