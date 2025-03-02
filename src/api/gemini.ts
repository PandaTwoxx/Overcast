'use server';

import {
    GoogleGenerativeAI,
    GenerativeModel,
    GenerateContentRequest,
    GenerateContentResult,
  } from "@google/generative-ai";
import 'dotenv/config';

  
  const apiKey = process.env.GEMINI_API_KEY || 'fake-api-key-please-replace-me';
  console.log(process.env)
  if (apiKey == undefined) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please set it before running this script."
    );
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  export async function gemini(name: string, description: string) {
    const parts = [
      {text: "Given an input of a json object in the format {name:\"\", description: \"\"}, output a list of 6 to 10 tags in an array. DO NOT USE MARKDOWN. Following is example input data and what you should output"},
      {text: "EXAMPLE DATA START"},
      {text: "input: {name: \"Trump\", description: \"Trump is the worst president\"}"},
      {text: "output: [\"US Politics\", \"Politics\", \"Controversial\", \"Trump\", \"Election\"]"},
      {text: "input: {name: \"3D printing is the future\", description: \"Astronauts on the ISS are using 3D printers to create things that would cost millions to ship\"}"},
      {text: "output: [\"Optimism\", \"Tech\", \"3D Printers\", \"Space\", \"ISS\", \"NASA\"]"},
      {text: "input: {name: \"Framework is the best\", description: \"Framework has recently releases a modular mini pc that is easily upgraded and has gb for gamers and is now the best tech brand\"}"},
      {text: "output: [\"Tech\", \"Framework\", \"PC\", \"RGB\", \"Mini PC\", \"Modular\",\"Controversial\"]"},
      {text: "EXAMPLE DATA END"},
      {text: "Create an \"output:\" for the following input"},
      {text: "input {name: "+name+", description: "+description+"}"}
    ];
  
    const request: GenerateContentRequest = {
      contents: [{ role: "user", parts }],
      generationConfig,
    };
  
    const result: GenerateContentResult = await model.generateContent(request);
    return result.response.text();
  }
  
  // You would call run() from another file like this:
  // import { run } from './your-file-name';
  //
  // run().then(output => {
  //   console.log(output);
  // });