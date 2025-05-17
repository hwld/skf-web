import { useNavigate } from "react-router";
import PageTitle from "~/components/page-title";
import type { ProblemSetFormData } from "~/components/problem-set-form";
import { useProblemSets } from "~/components/use-problem-sets";
import ProblemSetFormLayout from "../../components/problem-set-form-layout";
import { Paths } from "../paths";

export default function ProblemSetCreate() {
  const navigate = useNavigate();
  const { addProblemSet } = useProblemSets();

  function handleSubmit(data: ProblemSetFormData) {
    addProblemSet(data);
    navigate(Paths.home);
  }

  return (
    <ProblemSetFormLayout
      title={
        <PageTitle iconClass="i-tabler-folder-plus" title="問題セットの作成" />
      }
      onSubmit={handleSubmit}
    />
  );
}
