import ProjectionDataSource from "../ormconfig-projections";
import { MonthlyIncome } from "./infrastructure/projection-entities/MonthlyIncome";
import { SavedBankEvent } from "./infrastructure/EventStore";
import { ProjectionState } from "./infrastructure/projection-entities/ProjectionState";

let projectionStateInt: ProjectionState;

const getMonthlyIncomeRepo = async () => {
  if (!ProjectionDataSource.isInitialized)
    await ProjectionDataSource.initialize();

  return ProjectionDataSource.getRepository(MonthlyIncome);
};

const getProjectionStateRepo = async () => {
  if (!ProjectionDataSource.isInitialized)
    await ProjectionDataSource.initialize();

  return ProjectionDataSource.getRepository(ProjectionState);
};

const getProjectionState = async () => {
  if (!ProjectionDataSource.isInitialized)
    await ProjectionDataSource.initialize();

  projectionStateInt = await ProjectionDataSource.getRepository(
    ProjectionState
  ).findOneBy({
    name: "monthlyIncome",
  });

  if (!!projectionStateInt) return projectionStateInt;

  const newState = new ProjectionState();
  newState.name = "monthlyIncome";
  newState.latestSequenceId = 0;
  projectionStateInt = await ProjectionDataSource.getRepository(
    ProjectionState
  ).save(newState);
  return projectionStateInt;
};

const getMonthlyIncomeEntity = async (accountId: string, month: number) => {
  const monthlyIncome: MonthlyIncome = await getMonthlyIncomeRepo().then(
    (repo) =>
      repo.findOneBy({
        accountId: accountId,
        month: month,
      })
  );

  if (!!monthlyIncome) return monthlyIncome;

  const newMonthlyIncome = new MonthlyIncome();
  newMonthlyIncome.month = month;
  newMonthlyIncome.accountId = accountId;
  newMonthlyIncome.amount = 0;

  return newMonthlyIncome;
};

export const monthlyIncomeProjection = async (event: SavedBankEvent) => {
  const projectionState = await getProjectionState();
  const monthlyIncomeRepo = await getMonthlyIncomeRepo();
  const projectionStateRepo = await getProjectionStateRepo();

  if (event.sequenceId <= projectionState.latestSequenceId) return;

  if (event.type != "DepositMade" && event.type != "WithdrawalMade")
    throw new Error("Unexpected event");

  if (event.type === "DepositMade") {
    const monthlyIncome = await getMonthlyIncomeEntity(
      event.data.accountId,
      event.data.month
    );
    monthlyIncome.amount += event.data.amount;
    await monthlyIncomeRepo.save(monthlyIncome);
  }

  if (event.type === "WithdrawalMade") {
    const monthlyIncome = await getMonthlyIncomeEntity(
      event.data.accountId,
      event.data.month
    );
    monthlyIncome.amount -= event.data.amount;
    await monthlyIncomeRepo.save(monthlyIncome);
  }

  projectionState.latestSequenceId = event.sequenceId;
  await projectionStateRepo.save(projectionState);
};
