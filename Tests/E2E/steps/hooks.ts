import {createBdd} from "playwright-bdd";
import {logout, removeAllUsers} from "../helpers/system";

const {AfterScenario} = createBdd();

// cleanup for each scenario
AfterScenario(async ({page}) => {
    await logout(page);

    try {
        removeAllUsers();
    } catch (err) {
        console.warn('[AfterScenario] removeAllUsers failed — next scenario may see leftover users:', err);
    }
});
