import {createBdd} from "playwright-bdd";
import {removeAllUsersFactory} from "../helpers/test-api";
import {getUniqueUserNamePrefix} from "../helpers/user";

const {AfterScenario} = createBdd();

AfterScenario(async ({request, $testInfo}) => {
    const removeAllUsers = removeAllUsersFactory(request, $testInfo);

    // Removes unique users of this worker and all their workspaces and content
    await removeAllUsers(getUniqueUserNamePrefix());
});
