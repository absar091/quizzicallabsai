                  <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={index} className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{question.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.answers && (
                    <Accordion type="multiple" className="w-full space-y-3">
                      <AccordionItem value={`question-${index}`} className="border rounded-lg">
                        <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-left hover:no-underline">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            View Options (A, B, C, D)
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {question.answers.map((answer, answerIndex) => (
                              <div
                                key={answerIndex}
                                className="p-3 rounded-lg border bg-muted/30 border-muted"
                              >
                                <span className="font-medium text-primary mr-2">
                                  {String.fromCharCode(65 + answerIndex)}.
                                </span>
                                <span className="text-sm">{answer}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value={`answer-${index}`} className="border rounded-lg">
                        <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-left hover:no-underline">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            Show Answer
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-green-800 dark:text-green-200">
                                Correct Answer
                              </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              {String.fromCharCode(65 + question.answers.indexOf(question.correctAnswer))}. {question.correctAnswer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value={`explanation-${index}`} className="border rounded-lg">
                        <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-left hover:no-underline">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Show Explanation
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Detailed Explanation</AlertTitle>
                            <AlertDescription className="mt-2">
                              {question.explanation || "No explanation provided for this question."}
                            </AlertDescription>
                          </Alert>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
