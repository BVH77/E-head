<?php

class CronController extends OSDN_Controller_Action
{
    public function scheduleAction()
    {
        $this->disableRender(true);

        $config = Zend_Registry::get('config');
        $server = $config->mail->SMTP;

        $accounts = new OSDN_Accounts();

        // Send mail to production
        $persons = array();
        $response = $accounts->fetchByRole(4); // 4 = production
        if ($response->isSuccess()) {
            $rowset = $response->getRowset();
            foreach ($rowset as $row) {
                if ($row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                }
            }
        }
        if (!empty($persons)) {

            $mail = new Zend_Mail('UTF-8');
            $mail->setFrom($config->mail->from->address, $config->mail->from->caption);

            foreach ($persons as $person) {
                $mail->addTo($person['email'], $person['name']);
            }
            $mail->setSubject("График производства на завтра");
            $mail->setBodyHtml("http://$server/orders/report/schedule-production");

            try {
                $mail->send();
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }


        // Send mail to mount
        $persons = array();
        $response = $accounts->fetchByRole(5); // 5 = mount
        if ($response->isSuccess()) {
            $rowset = $response->getRowset();
            foreach ($rowset as $row) {
                if ($row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                }
            }
        }
        if (!empty($persons)) {

            $mail = new Zend_Mail('UTF-8');
            $mail->setFrom($config->mail->from->address, $config->mail->from->caption);

            foreach ($persons as $person) {
                $mail->addTo($person['email'], $person['name']);
            }
            $mail->setSubject("График монтажных работ на завтра");
            $mail->setBodyHtml("http://$server/orders/report/schedule-mount");

            try {
                $mail->send();
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    }
}