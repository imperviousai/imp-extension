import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

import appSyncConfig from "../aws-exports";
import { useAtom } from "jotai";
import { auth0TokenAtom } from "../stores/auth";

const ApolloWrapper = ({ children }) => {
  const [auth0Token] = useAtom(auth0TokenAtom);
  const fetchToken = async () => {
    console.log("Got the token now: ", auth0Token);
    return auth0Token;
  };

  const url = appSyncConfig.aws_appsync_graphqlEndpoint;
  const region = appSyncConfig.aws_appsync_region;
  const auth = {
    type: appSyncConfig.aws_appsync_authenticationType,
    jwtToken: () => fetchToken(),
  };

  const httpLink = new HttpLink({ uri: url });

  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
