import styled from "styled-components";

export default function Network() {
  return (
    <PageContainer>
      <PageTitle>Rede</PageTitle>
      <PageDescription>Visualização de rede com layout principal.</PageDescription>
    </PageContainer>
  );
}
const PageContainer = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const PageDescription = styled.p`
  margin: 0;
  opacity: 0.8;
`;