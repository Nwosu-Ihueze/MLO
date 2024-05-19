import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import type { Metadata } from 'next';
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: 'Home | Algo Query',
  keywords: "tensorflow object detection troubleshooting, pytorch neural network code debugging, scikit-learn machine learning model optimization, keras deep learning architecture design, r programming data preprocessing techniques, nlp text classification algorithm implementation, computer vision object tracking code examples, reinforcement learning agent training strategies, aws sagemaker deployment and monitoring, google colab gpu acceleration for deep learning, azure machine learning studio experiment tracking, data augmentation techniques for image recognition, hyperparameter tuning for xgboost models, explainable ai model interpretability methods, adversarial attack and defense strategies, transfer learning for natural language understanding, anomaly detection algorithms for time series data, bayesian optimization for hyperparameter tuning, dimensionality reduction techniques for high-dimensional data, ethical considerations in ai model development, pytorch lightning model checkpointing best practices, transformers hugging face Named Entity Recognition fine-tuning, scikit-learn random forest hyperparameter grid search, tensorflow object detection on edge devices optimization, aws sagemaker neo model compilation for inference, azure machine learning pipeline continuous integration, google vertex ai custom training job monitoring, openai whisper speech recognition model customization, chatgpt api integration for conversational ai, stable diffusion text-to-image model prompting techniques, federated learning privacy-preserving model training, amazon rekognition custom labels model retraining, google cloud ai platform model deployment versioning, self-supervised learning pretraining techniques, one-class support vector machine anomaly detection, graph neural networks node classification tasks, autoencoders for dimensionality reduction and denoising, generative adversarial networks image synthesis tips, deep reinforcement learning continuous control environments, mlops model monitoring and drift detection strategies "
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  let result;

  if(searchParams?.filter === 'recommended') {
    if(userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      }); 
    } else {
      result = {
        questions: [],
        isNext: false,
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    }); 
  }
  

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1> 

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link> 
      </div> 

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar 
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ?
          result.questions.map((question) => (
            <QuestionCard 
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
          : <NoResult 
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />}
      </div>
      <div className="mt-10">
        <Pagination 
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  )
}