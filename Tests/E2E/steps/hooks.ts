import {createBdd} from "playwright-bdd";
import {logout} from "../helpers/system";
import {removeAllUsers} from "../helpers/test-api";

const {AfterScenario} = createBdd();

// cleanup for each scenario
AfterScenario(async ({page}) => {
    await logout(page);

    await removeAllUsers();
});
