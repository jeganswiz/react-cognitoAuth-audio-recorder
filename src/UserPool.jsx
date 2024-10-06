import { CognitoUserPool } from "amazon-cognito-identity-js";
import { awsCognitoKeys } from "./config/devConfig";

const poolData = {
    UserPoolId : awsCognitoKeys.poolUserId,
    ClientId: awsCognitoKeys.clientId,
}

export default new CognitoUserPool(poolData);