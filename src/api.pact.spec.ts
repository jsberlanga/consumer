import { PactV3 as Pact, MatchersV3 as Matchers } from '@pact-foundation/pact';
import { APIGateway } from './api';

const mockProvider = new Pact({
  consumer: 'Usage Analytics Frontend',
  provider: 'Usage Analytics REST API',
  logLevel: 'info',
});

const mockVisitorsResponse = Matchers.like({
  results: Matchers.arrayContaining({
    isNewInPeriod: Matchers.boolean(true),
    currentVisits: Matchers.number(15),
    previousVisits: Matchers.number(2),
    daysActive: Matchers.number(4),
    fullName: Matchers.string('Christopher Weibel'),
    userName: Matchers.string('christopher.weibel'),
    userId: Matchers.string('5e3c90f5-048d-413b-bffb-0cb3bd44423d'),
    isDisabledUser: Matchers.boolean(false),
  }),
  success: Matchers.boolean(true),
});

const mockNoVisitorsResponse = Matchers.like({
  results: Matchers.nullValue(),
  success: Matchers.boolean(true),
});

describe('API Pact test', () => {
  describe('retrieving visitors', () => {
    test('visitors exists', async () => {
      /**
       * ARRANGE
       *
       * These lines below tells Pact to set the whole scenario up.
       * This will produce the Pact documentation so we want to be
       * as explicit and lengthy as possible.
       */
      await mockProvider
        .given('visitors exist')
        .uponReceiving('a request to get visitors')
        .withRequest({
          method: 'GET',
          path: '/visitors',
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: mockVisitorsResponse,
        });

      return mockProvider.executeTest(async (mockServer) => {
        /**
         * ACT
         *
         * We tell the API client to talk to the Pact mock server instead
         * of the real thing. Thus, in summary we mock the response that
         * comes from the API so that we can unit test it.
         */
        const API = new APIGateway(mockServer.url);
        const visitors = await API.getVisitors();

        /**
         * ASSERT
         *
         * We assert the mocked response the and expected response match.
         */
        expect(visitors).toEqual({
          results: [
            {
              isNewInPeriod: true,
              currentVisits: 15,
              previousVisits: 2,
              daysActive: 4,
              fullName: 'Christopher Weibel',
              userName: 'christopher.weibel',
              userId: '5e3c90f5-048d-413b-bffb-0cb3bd44423d',
              isDisabledUser: false,
            },
          ],
          success: true,
        });
        return;
      });
    });

    test('visitors do not exist', async () => {
      /**
       * ARRANGE
       *
       * These lines below tells Pact to set the whole scenario up.
       * This will produce the Pact documentation so we want to be
       * as explicit and lengthy as possible.
       */
      await mockProvider
        .given('no visitors')
        .uponReceiving('a request to get visitors')
        .withRequest({
          method: 'GET',
          path: '/visitors',
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: mockNoVisitorsResponse,
        });

      return mockProvider.executeTest(async (mockServer) => {
        /**
         * ACT
         *
         * We tell the API client to talk to the Pact mock server instead
         * of the real thing. Thus, in summary we mock the response that
         * comes from the API so that we can unit test it.
         */
        const API = new APIGateway(mockServer.url);
        const visitors = await API.getVisitors();

        /**
         * ASSERT
         *
         * We assert the mocked response the and expected response match.
         */
        expect(visitors).toEqual({
          results: null,
          success: true,
        });
        return;
      });
    });
  });
});
