import styled from 'styled-components';

const QuizInputOutputTable = ({
  inputData,
  outputData,
}: {
  inputData: string[];
  outputData: string[];
}) => {
  return (
    <>
      <Title>입출력 예</Title>
      <TableContainer>
        <thead>
          <tr>
            <th>INPUT</th>
            <th>OUTPUT</th>
          </tr>
        </thead>
        <tbody>
          {inputData.map((input, index) => {
            return (
              <tr key={index}>
                <td>{input}</td>
                <td>{outputData[index]}</td>
              </tr>
            );
          })}
        </tbody>
      </TableContainer>
    </>
  );
};

const Title = styled.div`
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  margin-top: 24px;
`;

const TableContainer = styled.table`
  display: block;
  min-height: 0.01%;
  border-bottom-right-radius: 0.1875rem;
  border-top-right-radius: 0.1875rem;
  border-spacing: 2px;
  text-indent: initial;
  font-size: 1.5rem;
  tr {
    display: table-row;
    vertical-align: inherit;
  }
  th {
    padding: 0.5rem;
    background: #202b3d;
    border: 2px solid #ffffff;
  }
  td {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 100;
    padding: 0.5rem;
    background: #202b3d;
    border: 2px solid #ffffff;
    color: #bebebe;
    font-size: 2rem;
  }
`;

export default QuizInputOutputTable;
