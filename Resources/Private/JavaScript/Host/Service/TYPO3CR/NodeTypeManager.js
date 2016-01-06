import NodeType from './Model/NodeType';

/**
 * The node type manager
 */
class NodeTypeManager {
    /**
     * Create node types out of a given node type schema
     *
     * @param  {Object} nodeTypeSchema The schema as JSON
     */
    initializeWithNodeTypeSchema(nodeTypeSchema) {
        this.nodeTypes = [];

        const {nodeTypes} = nodeTypeSchema;

        Object.keys(nodeTypes).forEach(nodeTypeName => {
            const nodeType = new NodeType(nodeTypeName, nodeTypes[nodeTypeName], this);

            this.nodeTypes.push(nodeType);
        });

        console.log(this.nodeTypes);
    }

    /**
     * Get a single node type by its name
     *
     * @param  {String} nodeTypeName The fully qualified node type name
     * @return {NodeType}            The node type object
     * @throws {Error}
     */
    getNodeType(nodeTypeName) {
        const nodeType = this.nodeTypes.filter(nodeType => nodeType.name === nodeTypeName).shift();

        if (!this.nodeTypes[nodeTypeName]) {
            throw new Error(`NodeType "${nodeTypeName} does not exist"`);
        }

        return nodeType;
    }

    /**
     * Check whether a node type is a subtype of another node type
     *
     * @param  {String} nodeTypeName           The fully qualified node type name of the inheritor
     * @param  {String} referenceNodeTypeName  The fully qualified node type name of the node type to be checked
     * @return {Boolean}                       True, if `nodeTypeName` inherits from `referenceNodeTypeName`
     */
    nodeTypeInherits(nodeTypeName, referenceNodeTypeName) {
        return this.getNodeType(nodeTypeName).isOfType(referenceNodeTypeName);
    }
}

const instance = new NodeTypeManager();

export default instance;
