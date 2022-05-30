import random
import cv2 as cv
from PIL import Image, ImageDraw
import PIL
# import cv

def image_proc(image):
    img = cv.imread(image)

    img_temp = Image.new('RGB', (img.shape[1], img.shape[0]), color='white')
    img_temp.save('img_temp.png')
    img_temp = cv.imread("img_temp.png")

    imgray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    ret, thresh = cv.threshold(imgray, 50, 255, cv.THRESH_BINARY)

    contours, hierarchy = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_TC89_KCOS)
    cv.drawContours(img_temp, contours, -1, (0, 0, 0), 2)

    for i in range(1, len(contours)):
        r = random.randrange(0, i * (255 // (i + 10)))
        g = random.randrange(0, i * (255 // (i + 10)))
        b = random.randrange(0, i * (255 // (i + 10)))
        cv.fillPoly(img_temp, pts=[contours[i]], color=(r, g, b))

    # cv.imshow('None', img_temp)
    # cv.waitKey(0)
    # cv.imwrite('img_temp.png', img_temp)
    # cv.destroyAllWindows()

    text_file = open("cords.txt", "w+")
    a = 0
    for elem in range(len(contours)):
        for i in contours[elem]:
            for j in i[0]:
                if a != 0:
                    text_file.write(',')
                text_file.write(str(j))
                a += 1
        text_file.write('\n')
        a = 0

    text_file.close()

    cont_list = []

    for elem in range(len(contours)):
        for i in contours[elem]:
            for j in i[0]:
                cont_list.append(str(j))
        cont_list.append(' ')

    new_cont_list = []

    i = 0
    new_list = []
    while i != len(cont_list):
        if cont_list[i] != ' ':
            new_list.append(cont_list[i])
        else:
            new_cont_list.append(new_list)
            new_list = []
        i += 1

    print(new_cont_list)
    return new_cont_list


if __name__ == '__main__':
    image_proc("plan.png")

