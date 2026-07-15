import {createBdd} from "playwright-bdd";
import {removeAllUsers} from "../helpers/test-api";
import {getUniqueUserNamePrefix} from "../helpers/user";

const {AfterScenario} = createBdd();

AfterScenario(async ({request}) => {
    // Removes unique users of this worker and all their workspaces and content
    await removeAllUsers(request, getUniqueUserNamePrefix());
});
