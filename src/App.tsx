import { useQuery } from '@tanstack/react-query';
import API, { Response } from './api';

export interface Visitors {
  isNewInPeriod: boolean;
  currentVisits: number;
  previousVisits: number;
  daysActive: number;
  fullName: string;
  userName: string;
  userId: string;
  isDisabledUser: boolean;
}

const useGetVisitors = () =>
  useQuery<Response<Visitors>>({
    queryKey: ['visitors'],
    queryFn: () => API.getVisitors(),
  });

function App() {
  const { data, isLoading } = useGetVisitors();

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <section>
      <h1>
        <u>Usage Analytics Consumer</u>
      </h1>
      <div>
        <h2>Visitors /GET Endpoint</h2>
        {data?.results.map((visitor) => (
          <div
            key={visitor.userId}
            className="visitor"
            data-disabled={visitor.isDisabledUser}
          >
            <p>
              <strong>ID:</strong> {visitor.userId}
            </p>
            <p>
              <strong>Name:</strong> {visitor.fullName}
            </p>
            <p>
              <strong>Current visits:</strong> {visitor.currentVisits}
            </p>
            <p>
              <strong>Previous visits:</strong> {visitor.previousVisits}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
