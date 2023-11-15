import pino from "pino";

const logger = pino();

export const submitHistory = async (
  userId: number,
  questionId: string,
  submittedCode: string,
): Promise<Response> => {
  try {
    logger.info("Submitting attempt to history repository...");

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        questionId,
        submittedCode,
      }),
    };

    const res = await fetch("http://localhost:1001/history", requestOptions);

    return res;
  } catch (error) {
    logger.error("Error submitting attempt to history repo", error.message);
    throw error;
  }
};
