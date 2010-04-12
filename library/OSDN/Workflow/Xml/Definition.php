<?php
/**
 * File containing the ezcWorkflowDefinitionStorageXml class.
 *
 * @package Workflow
 * @version 1.3.2
 * @copyright Copyright (C) 2005-2009 eZ Systems AS. All rights reserved.
 * @license http://ez.no/licenses/new_bsd New BSD License
 */

/**
 * XML workflow definition storage handler.
 *
 * The definitions are stored inside the directory specified to the constructor with the name:
 * [workflowName]_[workflowVersion].xml where the name of the workflow has dots and spaces
 * replaced by '_'.
 *
 * @todo DTD for the XML file.
 * @package Workflow
 * @version 1.3.2
 */
class OSDN_Workflow_Xml_Definition implements ezcWorkflowDefinitionStorage
{
    /**
     * The directory that holds the XML files.
     *
     * @var string
     */
    protected $directory;

    /**
     * Constructs a new definition loader that loads definitions from $directory.
     *
     * $directory must contain the trailing '/'
     *
     * @param  string $directory The directory that holds the XML files.
     */
    public function __construct( $directory = '' )
    {
        $this->directory = $directory;
    }

    /**
     * Load a workflow definition from a file.
     *
     * When the $workflowVersion argument is omitted,
     * the most recent version is loaded.
     *
     * @param  string $workflowName
     * @param  int    $workflowVersion
     * @return ezcWorkflow
     * @throws ezcWorkflowDefinitionStorageException
     */
    public function loadByName( $workflowName, $workflowVersion = 0 )
    {
        if ( $workflowVersion == 0 )
        {
            // Load the latest version of the workflow definition by default.
            $workflowVersion = $this->getCurrentVersion( $workflowName );
        }

        $filename = $this->getFilename( $workflowName, $workflowVersion );
        
        // Load the document.
        $document = new DOMDocument;

        if ( is_readable( $filename ) )
        {
            libxml_use_internal_errors(true);

            $xml = simplexml_load_file($filename);
            
            
            //$loaded = @$document->load( $filename );

//            if ( $loaded === false )
//            {
//                $message = '';
//
//                foreach ( libxml_get_errors() as $error )
//                {
//                    $message .= $error->message;
//                }
//
//                throw new ezcWorkflowDefinitionStorageException(
//                  sprintf(
//                    'Could not load workflow "%s" (version %d) from "%s".%s',
//
//                    $workflowName,
//                    $workflowVersion,
//                    $filename,
//                    $message != '' ? "\n" . $message : ''
//                  )
//                );
//            }
        }
        else
        {
            throw new ezcWorkflowDefinitionStorageException(
              sprintf(
                'Could not read file "%s".',
                $filename
              )
            );
        }

        return $this->loadFromDocument($xml);
    }

    /**
     * Load a workflow definition from a DOMDocument.
     *
     * @param  DOMDocument $document
     * @return ezcWorkflow
     */
    public function loadFromDocument(SimpleXMLElement $xml)
    {
        $workflowTitle    = isset($xml['title'])? (string)$xml['title']: null;
        $workflowName    = isset($xml['name'])? (string)$xml['name']: null;
        $workflowVersion = (isset($xml['version'])? (int)$xml['version']: null);

        $workflowPluginsArgs = isset($xml['plugins'])? (string)$xml['plugins']: array();
        $workflowPlugins = array();
        if (!empty($workflowPluginsArgs)) {
            $workflowPlugins = preg_split('/\s*,\s*/', $workflowPluginsArgs);
        }
        
        // Create node objects.
        $nodes    = array();
        $xmlNodes = $xml->node;

        foreach ( $xmlNodes as $xmlNode )
        {
            $id = (int)$xmlNode['id'];
             
            $className = $this->getClassNameByType((string)$xmlNode['type']);
            
            $element = $xmlNode;
            $configuration = array();
            switch (true) {
                case $this->isInstanceOf($className, 'OSDN_Workflow_Node_SetStep'):
                case $this->isInstanceOf($className, 'OSDN_Workflow_Node_UnsetStep'):
                    $configuration['step'] = (string)$xmlNode['value'];
                    if ((string)$xmlNode['unset']) {
                        $configuration['unset'] = array_map('trim', explode(',',(string)$xmlNode['unset']));
                    }
                    if ($xmlNode->unset) {
                        if (empty($configuration['unset'])) {
                            $configuration['unset'] = array();
                        }
                        foreach ($xmlNode->unset->variable as $variable) {
                            $configuration['unset'][] = (string)$variable['name'];
                        }
                    }
                break;
                case $this->isInstanceOf($className, 'OSDN_Workflow_Node_InputAction'):
                    $configuration['variables'] = array();
                    if ((string)$xmlNode['variables']) {
                        $input = array_map('trim', explode(',', (string)$xmlNode['variables']));
                        foreach ($input as $v) {
                            $configuration['variables'][$v] = new ezcWorkflowConditionIsAnything();
                        }
                    }
                    if ($xmlNode->variable) {
                        foreach ($xmlNode->variable as $variable) {
                            $configuration['variables'][(string)$variable['name']] = self::xmlToCondition(
                                $variable->condition
                            );
                        }
                    }
                case $this->isInstanceOf($className, 'ezcWorkflowNodeAction'):
                    if ((string)$xmlNode['serviceObjectClass']) {
                        $configuration['class'] = (string)$xmlNode['serviceObjectClass'];
                    } else {
                        $configuration['class'] = (string)$xmlNode['class'];
                    }
                    $configuration['arguments'] = array();
                    $childNode = $xmlNode[0];
                    if ($childNode->getName() == 'arguments') {
                        foreach ($childNode->children() as $argument) {
                            $configuration['arguments'][] = self::xmlToVariable($argument);
                        }
                    }
                break;
                
                case $this->isInstanceOf($className, 'ezcWorkflowNodeSubWorkflow'):
                    $configuration = array(
                        'workflow'  => (string)$xmlNode['subWorkflowName'],
                        'variables' => array(
                            'in' => array(),
                            'out' => array()
                        )
                    );
                // TODO  change these stufs to simple xml 
                    $xpath = new DOMXPath( $xmlNode->ownerDocument );
                    $in    = $xpath->query( 'in/variable', $xmlNode );
                    $out   = $xpath->query( 'out/variable', $xmlNode );
            
                    foreach ( $in as $variable ) {
                        $configuration['variables']['in'][$variable->getAttribute( 'name' )] = $variable->getAttribute( 'as' );
                    }
            
                    foreach ( $out as $variable ) {
                        $configuration['variables']['out'][$variable->getAttribute( 'name' )] = $variable->getAttribute( 'as' );
                    }
                break;
                
                case $this->isInstanceOf($className, 'ezcWorkflowNodeInput'):
                    if ((string)$xmlNode['variables']) {
                        $input = array_map('trim', explode(',', (string)$xmlNode['variables']));
                        foreach ($input as $v) {
                            $configuration[$v] = new ezcWorkflowConditionIsAnything();
                        }
                    }
                    if ($xmlNode->variable) {
                        foreach ($xmlNode->variable as $variable) {
                            $configuration[(string)$variable['name']] = self::xmlToCondition(
                                $variable->condition
                            );
                        }
                    }
                break;
                
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableSet'):
                    foreach ($xmlNode->variable as $variable) {
                        $configuration[(string)$variable['name']] = self::xmlToVariable(
                            $variable[0]
                        );
                    }
                break;
                
                case  $this->isInstanceOf( $className, 'ezcWorkflowNodeVariableUnset'):
                    foreach ($xmlNode->variable as $variable) {
                        $configuration[] = (string)$variable['name'];
                    }
                break;
                
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableDecrement'):
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableIncrement'):
                    $configuration = (string)$xmlNode->variable;
                break;
                
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableAdd'):
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableDiv'):
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableMul'):
                case  $this->isInstanceOf($className, 'ezcWorkflowNodeVariableSub'):
                    $configuration['name'] = (string)$xmlNode->variable;
                    $configuration['operand'] = (string)$xmlNode->operand;
                break;
            }
            
            if (empty($configuration)) {
                $configuration = ezcWorkflowUtil::getDefaultConfiguration($className);
            }
            
            $node = new $className($configuration);
            $node->setId($id);
                        
            switch (true) {
                case $node instanceof ezcWorkflowNodeFinally && !isset($finallyNode):
                    $finallyNode = $node;
                break;
                case $node instanceof ezcWorkflowNodeEnd && !isset($defaultEndNode):
                    $defaultEndNode = $node;
                break;
                case $node instanceof ezcWorkflowNodeStart:
                    $startNode = $node;
                break;
            }
            $nodes[$id] = $node;
        }

        if (!isset($startNode) || !isset($defaultEndNode))
        {
            throw new ezcWorkflowDefinitionStorageException(
                'Could not load workflow definition.'
            );
        }

        // Connect node objects.
        foreach ($xmlNodes as $xmlNode)
        {
            $id        = (int)$xmlNode['id'];
            $className = $this->getClassNameByType((string)$xmlNode['type']);
            
            $outNodes = $xmlNode->xpath('.//outNode');
            
            foreach ($outNodes as $outNode)
            {
                $nodes[$id]->addOutNode($nodes[(int)$outNode['id']]);
            }

            if (is_subclass_of($className, 'ezcWorkflowNodeConditionalBranch'))
            {
                
                
                foreach ($xmlNode->children() as $childNode)
                {
                    if ($childNode instanceof SimpleXMLElement && $childNode->getName() == 'condition')
                    {
                        
                        $elseNodes = $childNode->xpath('.//else');
                        foreach ($elseNodes as $elseNode)
                        {
                            foreach ($elseNode->children() as $outNode)
                            {
                                $elseId = (int)$outNode['id'];
                            }
                        }
                        
                        $condition = self::xmlToCondition($childNode);
                        $trueOutNodes = $childNode->xpath('.//condition/outNode');
                        foreach ($trueOutNodes as $outNode)
                        {
                            $conf = $nodes[$id]->getConfiguration();
                            if (isset($conf['condition'][ezcWorkflowUtil::findObject($nodes[$id]->getOutNodes(), $nodes[(int)$outNode['id']])]))
                            {
                                continue;
                            }
                            
                            if (!isset($elseId))
                            {
                                $nodes[$id]->addConditionalOutNode(
                                  $condition,
                                  $nodes[(int)$outNode['id']]
                                );
                            } else {
                                 $nodes[$id]->addConditionalOutNode(
                                  $condition,
                                  $nodes[(int)$outNode['id']],
                                  $nodes[$elseId]
                                );
                                unset($elseId);
                            }
                        }
                    }
                }
            }
//            if ($id == 203) {
//                var_dump($nodes[$id]->getConfiguration());
//                echo 'sdfsdfs';
//                exit;
//            }
        }
        
        if (!isset($finallyNode) || count($finallyNode->getInNodes()) > 0) {
            $finallyNode = null;
        }

        // Create workflow object and add the node objects to it.
        $workflow = new OSDN_Workflow($workflowName, $startNode, $defaultEndNode, $finallyNode);
        $workflow->definitionStorage = $this;
        $workflow->version = $workflowVersion;
        $workflow->title = $workflowTitle;
        $workflow->plugins = $workflowPlugins;

        // Handle the variable handlers.
        foreach ($xml->variableHandler as $variableHandler)
        {
            $workflow->addVariableHandler(
                $variableHandler['variable'],
                $variableHandler['class']
            );
        }

        // Verify the loaded workflow.
        $workflow->verify();

        return $workflow;
    }

    /**
     * Save a workflow definition to a file.
     *
     * @param  ezcWorkflow $workflow
     * @throws ezcWorkflowDefinitionStorageException
     */
    public function save( ezcWorkflow $workflow )
    {
        $workflowVersion = $this->getCurrentVersion( $workflow->name ) + 1;
        $filename        = $this->getFilename( $workflow->name, $workflowVersion );
        $document        = $this->saveToDocument( $workflow, $workflowVersion );

        file_put_contents( $filename, $document->saveXML() );
    }

    /**
     * Save a workflow definition to a DOMDocument.
     *
     * @param  ezcWorkflow $workflow
     * @param  int         $workflowVersion
     * @return DOMDocument
     */
    public function saveToDocument( OSDN_Workflow $workflow, $workflowVersion )
    {
        $document = new DOMDocument( '1.0', 'UTF-8' );
        $document->formatOutput = true;

        $root = $document->createElement( 'workflow' );
        $document->appendChild( $root );

        $root->setAttribute( 'name', $workflow->name );
        $root->setAttribute( 'version', $workflowVersion );

        $nodes    = $workflow->nodes;
        $numNodes = count( $nodes );

        // Workaround for foreach() bug in PHP 5.2.1.
        // http://bugs.php.net/bug.php?id=40608
        $keys = array_keys( $nodes );

        for ( $i = 0; $i < $numNodes; $i++ )
        {
            $id        = $keys[$i];
            $node      = $nodes[$id];
            $nodeClass = get_class( $node );

            $xmlNode = $document->createElement( 'node' );
            $xmlNode->setAttribute( 'id', $id );
            $xmlNode->setAttribute(
              'type',
              str_replace( 'ezcWorkflowNode', '', get_class( $node ) )
            );

            $node->configurationtoXML( $xmlNode );
            $root->appendChild( $xmlNode );

            $outNodes    = $node->getOutNodes();
            $_keys       = array_keys( $outNodes );
            $numOutNodes = count( $_keys );

            for ( $j = 0; $j < $numOutNodes; $j++ )
            {
                foreach ( $nodes as $outNodeId => $_node )
                {
                    if ( $_node === $outNodes[$_keys[$j]] )
                    {
                        break;
                    }
                }

                $xmlOutNode = $document->createElement( 'outNode' );
                $xmlOutNode->setAttribute( 'id', $outNodeId );

                if ( is_subclass_of( $nodeClass, 'ezcWorkflowNodeConditionalBranch' ) &&
                      $condition = $node->getCondition( $outNodes[$_keys[$j]] ) )
                {
                    if ( !$node->isElse( $outNodes[$_keys[$j]] ) )
                    {
                        $xmlCondition = self::conditionToXml(
                          $condition,
                          $document
                        );

                        $xmlCondition->appendChild( $xmlOutNode );
                        $xmlNode->appendChild( $xmlCondition );
                    }
                    else
                    {
                        $xmlElse = $xmlCondition->appendChild( $document->createElement( 'else' ) );
                        $xmlElse->appendChild( $xmlOutNode );
                    }
                }
                else
                {
                    $xmlNode->appendChild( $xmlOutNode );
                }
            }
        }

        foreach ( $workflow->getVariableHandlers() as $variable => $class )
        {
            $variableHandler = $root->appendChild(
              $document->createElement( 'variableHandler' )
            );

            $variableHandler->setAttribute( 'variable', $variable );
            $variableHandler->setAttribute( 'class', $class );
        }

        return $document;
    }

    /**
     * "Convert" an ezcWorkflowCondition object into an DOMElement object.
     *
     * @param  ezcWorkflowCondition $condition
     * @param  DOMDocument $document
     * @return DOMElement
     */
    public static function conditionToXml( ezcWorkflowCondition $condition, SimpleXMLElement $document )
    {
        $xmlCondition = $document->createElement( 'condition' );

        $conditionClass = get_class( $condition );
        $conditionType  = str_replace( 'ezcWorkflowCondition', '', $conditionClass );

        $xmlCondition->setAttribute( 'type', $conditionType );

        switch ( $conditionClass )
        {
            case 'ezcWorkflowConditionVariable': {
                $xmlCondition->setAttribute( 'name', $condition->getVariableName() );

                $xmlCondition->appendChild(
                  self::conditionToXml( $condition->getCondition(), $document )
                );
            }
            break;

            case 'ezcWorkflowConditionVariables': {
                list( $variableNameA, $variableNameB ) = $condition->getVariableNames();

                $xmlCondition->setAttribute( 'a', $variableNameA );
                $xmlCondition->setAttribute( 'b', $variableNameB );

                $xmlCondition->appendChild(
                  self::conditionToXml( $condition->getCondition(), $document )
                );
            }
            break;

            case 'ezcWorkflowConditionAnd':
            case 'ezcWorkflowConditionOr':
            case 'ezcWorkflowConditionXor': {
                foreach ( $condition->getConditions() as $childCondition )
                {
                    $xmlCondition->appendChild(
                      self::conditionToXml( $childCondition, $document )
                    );
                }
            }
            break;

            case 'ezcWorkflowConditionNot': {
                $xmlCondition->appendChild(
                  self::conditionToXml( $condition->getCondition(), $document )
                );
            }
            break;

            case 'ezcWorkflowConditionIsEqual':
            case 'ezcWorkflowConditionIsEqualOrGreaterThan':
            case 'ezcWorkflowConditionIsEqualOrLessThan':
            case 'ezcWorkflowConditionIsGreaterThan':
            case 'ezcWorkflowConditionIsLessThan':
            case 'ezcWorkflowConditionIsNotEqual': {
                $xmlCondition->setAttribute( 'value', $condition->getValue() );
            }
            break;

            case 'ezcWorkflowConditionInArray': {
                $xmlCondition->appendChild(
                  self::variableToXml( $condition->getValue(), $document )
                );
            }
            break;
        }

        return $xmlCondition;
    }

    /**
     * "Convert" an DOMElement object into an ezcWorkflowCondition object.
     *
     * @param  DOMElement $element
     * @return ezcWorkflowCondition
     */
    public static function xmlToCondition( SimpleXMLElement $element )
    {
        $class = 'ezcWorkflowCondition' . (string)$element['type'];
        
        switch ( $class )
        {
            case 'ezcWorkflowConditionVariable': {
                return new $class(
                  (string)$element['name'],
                  self::xmlToCondition($element->condition)
                );
            }
            break;

            case 'ezcWorkflowConditionVariables': {
                return new $class(
                  (string)$element['a'],
                  (string)$element['b'],
                  self::xmlToCondition($element->condition)
                );
            }
            break;

            case 'ezcWorkflowConditionAnd':
            case 'ezcWorkflowConditionOr':
            case 'ezcWorkflowConditionXor': {
                $conditions = array();
                foreach ($element->children() as $childNode)
                {
                    if ( $childNode instanceof DOMElement && $childNode->getName() == 'condition' )
                    {
                        $conditions[] = self::xmlToCondition($childNode);
                    }
                }

                return new $class($conditions);
            }
            break;

            case 'ezcWorkflowConditionNot': {
                return new $class(self::xmlToCondition($element[0]));
            }
            break;

            case 'ezcWorkflowConditionIsEqual':
            case 'ezcWorkflowConditionIsEqualOrGreaterThan':
            case 'ezcWorkflowConditionIsEqualOrLessThan':
            case 'ezcWorkflowConditionIsGreaterThan':
            case 'ezcWorkflowConditionIsLessThan':
            case 'ezcWorkflowConditionIsNotEqual': {
                return new $class((string)$element['value']);
            }
            break;

            case 'ezcWorkflowConditionInArray': {
                return new $class(self::xmlToVariable($element[0]));
            }
            break;

            default: {
                return new $class;
            }
            break;
        }
    }

    /**
     * "Convert" a PHP variable into an DOMElement object.
     *
     * @param  mixed $variable
     * @param  DOMDocument $document
     * @return DOMElement
     */
    public static function variableToXml( $variable, DOMDocument $document )
    {
        if ( is_array( $variable ) )
        {
            $xmlResult = $document->createElement( 'array' );

            foreach ( $variable as $key => $value )
            {
                $element = $document->createElement( 'element' );
                $element->setAttribute( 'key', $key );
                $element->appendChild( self::variableToXml( $value, $document ) );

                $xmlResult->appendChild( $element );
            }
        }

        if ( is_object( $variable ) )
        {
            $xmlResult = $document->createElement( 'object' );
            $xmlResult->setAttribute( 'class', get_class( $variable ) );
        }

        if ( is_null( $variable ) )
        {
            $xmlResult = $document->createElement( 'null' );
        }

        if ( is_scalar( $variable ) )
        {
            $type = gettype( $variable );

            if ( is_bool( $variable ) )
            {
                $variable = $variable === true ? 'true' : 'false';
            }

            $xmlResult = $document->createElement( $type, $variable );
        }

        return $xmlResult;
    }

    /**
     * "Convert" an DOMElement object into a PHP variable.
     *
     * @param  SimpleXMLElement $element
     * @return mixed
     */
    public static function xmlToVariable( SimpleXMLElement $element )
    {
        $variable = null;

        switch ($element->getName())
        {
            case 'array': {
                $variable = array();

                foreach ( $element->element as $element )
                {
                    $value = (string) self::xmlToVariable( $element[0]);

                    if (isset($element['key']))
                    {
                        $variable[ (string)$element['key'] ] = $value;
                    }
                    else
                    {
                        $variable[] = $value;
                    }
                }
            }
            break;

            case 'object': {
                $className = $element['class'];
                if (count($element->children()) > 0)
                {
                    $arguments       = $element[0]->children();
                    $constructorArgs = array();

                    foreach ($arguments as $argument)
                    {
                        if ($argument instanceof SimpleXMLElement)
                        {
                            $constructorArgs[] = self::xmlToVariable($argument);
                        }
                    }

                    $class    = new ReflectionClass( $className );
                    $variable = $class->newInstanceArgs($constructorArgs);
                }
                else
                {
                    $variable = new $className;
                }
            }
            break;

            case 'boolean': {
                $variable = (string)$element == 'true' ? true : false;
            }
            break;

            case 'integer':
            case 'double':
            case 'string': {
                $variable = (string)$element;
                settype($variable, $element->getName());
            }
        }

        return $variable;
    }
    
    
//    /**
//     * "Convert" an DOMElement object into a PHP variable.
//     *
//     * @param  DOMElement $element
//     * @return mixed
//     */
//    public static function xmlToVariable( DOMElement $element )
//    {
//        $variable = null;
//
//        switch ( $element->tagName )
//        {
//            case 'array': {
//                
//                $variable = array();
//
//                foreach ( $element->getElementsByTagName( 'element' ) as $element )
//                {
//                    $value = self::xmlToVariable( $element->childNodes->item( 1 ) );
//
//                    if ( $element->hasAttribute( 'key' ) )
//                    {
//                        $variable[ (string)$element->getAttribute( 'key' ) ] = $value;
//                    }
//                    else
//                    {
//                        $variable[] = $value;
//                    }
//                }
//                
//            }
//            break;
//
//            case 'object': {
//                $className = $element->getAttribute( 'class' );
//
//                if ( $element->hasChildNodes() )
//                {
//                    $arguments       = $element->childNodes->item( 1 )->childNodes;
//                    $constructorArgs = array();
//
//                    foreach ( $arguments as $argument )
//                    {
//                        if ( $argument instanceof DOMElement )
//                        {
//                            $constructorArgs[] = self::xmlToVariable( $argument );
//                        }
//                    }
//
//                    $class    = new ReflectionClass( $className );
//                    $variable = $class->newInstanceArgs( $constructorArgs );
//                }
//                else
//                {
//                    $variable = new $className;
//                }
//            }
//            break;
//
//            case 'boolean': {
//                $variable = $element->nodeValue == 'true' ? true : false;
//            }
//            break;
//
//            case 'integer':
//            case 'double':
//            case 'string': {
//                $variable = $element->nodeValue;
//
//                settype( $variable, $element->tagName );
//            }
//        }
//
//        return $variable;
//    }

    /**
     * Returns the current version number for a given workflow name.
     *
     * @param  string $workflowName
     * @return integer
     */
    protected function getCurrentVersion( $workflowName )
    {
        $workflowName = $this->getFilesystemWorkflowName( $workflowName );
        $files = glob( $this->directory . $workflowName . '_*.xml' );

        if ( !empty( $files ) )
        {
            return (int)str_replace(
              array(
                $this->directory . $workflowName . '_',
                '.xml'
              ),
              '',
              $files[count( $files ) - 1]
            );
        }
        else
        {
            return 0;
        }
    }

    /**
     * Returns the filename with path for given workflow name and version.
     *
     * The name of the workflow file is of the format [workFlowName]_[workFlowVersion].xml
     *
     * @param  string  $workflowName
     * @param  int $workflowVersion
     * @return string
     */
    protected function getFilename( $workflowName, $workflowVersion )
    {
        return sprintf(
          '%s%s_%d.xml',

          $this->directory,
          $this->getFilesystemWorkflowName( $workflowName ),
          $workflowVersion
        );
    }

    /**
     * Returns a safe filesystem name for a given workflow.
     *
     * This method replaces whitespace and '.' with '_'.
     *
     * @param  string $workflowName
     * @return string
     */
    protected function getFilesystemWorkflowName( $workflowName )
    {
        return preg_replace( '#[^\w.]#', '_', $workflowName );
    }

    /**
     * Check instance of class passed as string
     *
     * @param  string $classA
     * @param  string $classB
     *
     * @return string
     */
    protected function isInstanceOf($classA, $classB)
    {
        $res = is_subclass_of($classA, $classB) || $classA === $classB;
        return $res;
    }
    
    /**
     * return class name for type
     *
     * @param  string $type
     *
     * @return string
     */
    protected function getClassNameByType($type)
    {
        $className = 'ezcWorkflowNode' . $type;
        if (!class_exists($className)) {
            $className = 'OSDN_Workflow_Node_' . $type;
        }
        if (!class_exists($className)) {
            $className = $type;
        }
        return $className;
    }
}
?>
