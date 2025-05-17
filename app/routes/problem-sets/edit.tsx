import { useNavigate } from "react-router";
import PageTitle from "~/components/page-title";
import type { ProblemSetFormData } from "~/components/problem-set-form";
import { useProblemSets } from "~/components/use-problem-sets";
import ProblemSetFormLayout from "../../components/problem-set-form-layout";
import { Paths } from "../paths";
import type { Route } from "./+types/edit";

export default function ProblemSetEdit({
  params: { id },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const { problemSets, updateProblemSet } = useProblemSets();
  const problem = problemSets.find((set) => set.id === id);
  if (!problem) {
    throw new Error("問題セットが存在しませんでした");
  }

  function handleSubmit(data: ProblemSetFormData) {
    if (!problem) {
      return;
    }
    updateProblemSet(problem.id, data);
    navigate(Paths.home);
  }

  return (
    <ProblemSetFormLayout
      defaultValues={{
        title: problem.title,
        problemIds: problem.problemIds.map((id) => ({ value: id })),
      }}
      title={<PageTitle iconClass="i-tabler-edit" title="問題セットの編集" />}
      onSubmit={handleSubmit}
    />
  );
}
