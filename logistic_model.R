train = read.csv('data/train.csv', header=TRUE)
test = read.csv('data/test.csv', header=TRUE)
head(train)

model = glm(type~title_pred_prob*content_pred_prob, data=train, family=binomial(link='logit'))
summary(model)
coef(model)

p = predict(model, test, type="response")
c = ifelse(p > 0.5, 1, 0)
mean(test$type == c)
