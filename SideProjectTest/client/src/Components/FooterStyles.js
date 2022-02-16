import styled from 'styled-components';
   
export const Box = styled.div`
  padding: 10px 6px;
  background: black;
  position: bottom;
  bottom: 0;
  width: 100%;
  
   
  @media (max-width: 100%) {
    padding: 7px 3px;
  }
`;
   
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    max-width: 100%;
    margin: 0 auto;
    /* background: red; */
`
   
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 20px;
`;
   
export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 
                         minmax(185px, 1fr));
  grid-gap: 2px;
   
  @media (max-width: 100%) {
    grid-template-columns: repeat(auto-fill, 
                           minmax(200px, 1fr));
  }
`;
   
export const FooterLink = styled.a`
  color: #fff;
  margin-bottom: 8px;
  font-size: 8px;
  text-decoration: none;
   
  &:hover {
      color: rgb(239,96,39);
      transition: 200ms ease-in;
  }
`;
   
export const Heading = styled.p`
  font-size: 10px;
  color: #fff;
  margin-bottom: 5px;
  font-weight: bold;
`;