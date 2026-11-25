import {createBdd, DataTable} from "playwright-bdd";
import {createUser, executeGenericCommand, logout} from "../helpers/system.ts";

const {Given, When, Then} = createBdd();

When(
    "the command {string} is executed with payload:",
    async ({}, command: string, dataTable: DataTable) => {
        const payload: Record<string, string> = {};
        const [, ...rows] = dataTable.raw();
        for (const row of rows) {
            const key = row[0]!;
            const value = row[1]!;
            payload[key] = value;
        }
        await executeGenericCommand(command, payload).then(
            (res) => {
                console.log(res)
            }
        )
    },
);
