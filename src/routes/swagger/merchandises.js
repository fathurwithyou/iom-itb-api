/**
 * @swagger
 *
 * /merchandises:
 *   get:
 *     summary: List merchandise for users
 *     tags: [Merchandise]
 *     parameters:
 *      - in: query
 *        name: page
 *        required: false
 *        description: The page of list
 *        example: 1
 *      - in: query
 *        name: limit
 *        required: false
 *        description: The length of list
 *        example: 10
 *      - in: query
 *        name: search
 *        required: false
 *        description: Search by merchandise name
 *     responses:
 *       200:
 *         description: A list of merchandise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new merchandise
 *     tags: [Merchandise]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Merchandise name
 *                 type: string
 *                 example: T-Shirt
 *               description:
 *                 description: Merchandise description
 *                 type: string
 *                 example: This is a cool T-Shirt
 *               price:
 *                 description: Merchandise price
 *                 type: number
 *                 example: 100000
 *               stock:
 *                 description: Merchandise stock
 *                 type: integer
 *                 example: 100
 *               image:
 *                 description: Merchandise image file
 *                 type: string
 *                 format: binary
 *               link:
 *                 description: External purchase link
 *                 type: string
 *                 example: https://example.com/product
 *     responses:
 *       201:
 *         description: Merchandise successfully created
 *       500:
 *         description: Internal Server Error
 *
 * /merchandises/{id}:
 *   get:
 *     summary: Get merchandise detail for users
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     responses:
 *       200:
 *         description: Merchandise detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid merchandise id
 *       404:
 *         description: Merchandise not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update merchandise
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Merchandise name
 *                 type: string
 *                 example: T-Shirt
 *               description:
 *                 description: Merchandise description
 *                 type: string
 *                 example: This is a cool T-Shirt
 *               price:
 *                 description: Merchandise price
 *                 type: number
 *                 example: 100000
 *               stock:
 *                 description: Merchandise stock
 *                 type: integer
 *                 example: 100
 *               image:
 *                 description: Merchandise image file
 *                 type: string
 *                 format: binary
 *               link:
 *                 description: External purchase link
 *                 type: string
 *                 example: https://example.com/product
 *     responses:
 *       200:
 *         description: Merchandise successfully updated
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete merchandise
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     responses:
 *       200:
 *         description: Merchandise successfully deleted
 *       500:
 *         description: Internal Server Error
 */
